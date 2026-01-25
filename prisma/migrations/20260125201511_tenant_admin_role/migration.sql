CREATE OR REPLACE FUNCTION prevent_modifying_tenant_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.name = 'tenant_admin' THEN
        RAISE EXCEPTION 'The tenant_admin role cannot be modified or deleted';
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Bloquear UPDATE
CREATE TRIGGER prevent_update_tenant_admin_role
BEFORE UPDATE ON "Role"
FOR EACH ROW
WHEN (OLD.name = 'tenant_admin')
EXECUTE FUNCTION prevent_modifying_tenant_admin_role();

-- Bloquear DELETE
CREATE TRIGGER prevent_delete_tenant_admin_role
BEFORE DELETE ON "Role"
FOR EACH ROW
WHEN (OLD.name = 'tenant_admin')
EXECUTE FUNCTION prevent_modifying_tenant_admin_role();



CREATE OR REPLACE FUNCTION prevent_removing_last_tenant_admin()
RETURNS TRIGGER AS $$
DECLARE
    tenant_id TEXT;
    admin_count INTEGER;
BEGIN
    -- Obtener tenant del usuario afectado
    SELECT "tenantId" INTO tenant_id
    FROM "User"
    WHERE id = OLD."userId";

    -- Solo actuar si el rol es tenant_admin
    IF (SELECT name FROM "Role" WHERE id = OLD."roleId") = 'tenant_admin' THEN
        
        -- Contar cuántos usuarios tienen tenant_admin en este tenant
        SELECT COUNT(*) INTO admin_count
        FROM "UserRole" ur
        JOIN "User" u ON u.id = ur."userId"
        JOIN "Role" r ON r.id = ur."roleId"
        WHERE r.name = 'tenant_admin'
          AND u."tenantId" = tenant_id;

        -- Si solo hay 1, impedir la operación
        IF admin_count <= 1 THEN
            RAISE EXCEPTION 'Cannot remove tenant_admin: this is the last administrator of the tenant, you have to assign another administrator before deleting the role from this one';
        END IF;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_removing_last_tenant_admin_trigger
BEFORE DELETE ON "UserRole"
FOR EACH ROW
EXECUTE FUNCTION prevent_removing_last_tenant_admin();




CREATE OR REPLACE FUNCTION prevent_deactivating_last_tenant_admin()
RETURNS TRIGGER AS $$
DECLARE
    admin_count INTEGER;
BEGIN
    -- Solo actuar si se está desactivando
    IF OLD."isActive" = TRUE AND NEW."isActive" = FALSE THEN
        
        -- Contar cuántos tenant_admin hay en este tenant
        SELECT COUNT(*) INTO admin_count
        FROM "UserRole" ur
        JOIN "Role" r ON r.id = ur."roleId"
        WHERE ur."userId" IN (
            SELECT id FROM "User" WHERE "tenantId" = OLD."tenantId" AND "isActive" = TRUE
        )
        AND r.name = 'tenant_admin';

        -- Si solo hay 1, impedir desactivación
        IF admin_count <= 1 THEN
            RAISE EXCEPTION 'Cannot deactivate this user: they are the last tenant_admin of the tenant, assign another before deactivating this one';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_deactivating_last_tenant_admin_trigger
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION prevent_deactivating_last_tenant_admin();
