-- Prevent assigning inactive roles to users
CREATE OR REPLACE FUNCTION prevent_assign_inactive_role()
RETURNS TRIGGER AS $$
DECLARE
    active BOOLEAN;
BEGIN
    -- Check if the role is active
    SELECT "isActive" INTO active
    FROM "Role"
    WHERE id = NEW."roleId";

    IF active IS NOT TRUE THEN
        RAISE EXCEPTION 'Cannot assign inactive role to user';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for UserRole insert
CREATE TRIGGER prevent_assign_inactive_role_trigger
BEFORE INSERT ON "UserRole"
FOR EACH ROW
EXECUTE FUNCTION prevent_assign_inactive_role();


-- Prevent assigning inactive scopes to roles
CREATE OR REPLACE FUNCTION prevent_assign_inactive_scope()
RETURNS TRIGGER AS $$
DECLARE
    active BOOLEAN;
BEGIN
    -- Check if the scope is active
    SELECT "isActive" INTO active
    FROM "Scope"
    WHERE id = NEW."scopeId";

    IF active IS NOT TRUE THEN
        RAISE EXCEPTION 'Cannot assign inactive scope to role';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for RoleScope insert
CREATE TRIGGER prevent_assign_inactive_scope_trigger
BEFORE INSERT ON "RoleScope"
FOR EACH ROW
EXECUTE FUNCTION prevent_assign_inactive_scope();
