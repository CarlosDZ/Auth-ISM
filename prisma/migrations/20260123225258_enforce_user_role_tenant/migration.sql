-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('ACCESS', 'REFRESH', 'API_KEY', 'MAGIC_LINK', 'PASSWORD_RESET', 'EMAIL_VERIFY');

-- CreateEnum
CREATE TYPE "LoginFailReason" AS ENUM ('INVALID_EMAIL', 'INVALID_PASSWORD', 'USER_INACTIVE', 'USER_BLOCKED', 'TENANT_INACTIVE', 'MFA_REQUIRED', 'MFA_FAILED', 'RATE_LIMITED', 'PASSWORD_EXPIRED', 'NOT_ALLOWED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AuditEvent" AS ENUM ('USER_CREATED', 'USER_UPDATED', 'USER_DEACTIVATED', 'USER_REACTIVATED', 'ROLE_ASSIGNED', 'ROLE_UNASSIGNED', 'SCOPE_ADDED_TO_ROLE', 'SCOPE_REMOVED_FROM_ROLE', 'SESSION_REVOKED', 'SESSION_CREATED', 'PASSWORD_CHANGED', 'PASSWORD_RESET', 'MFA_ENABLED', 'MFA_DISABLED', 'TENANT_CREATED', 'TENANT_UPDATED', 'TENANT_SUSPENDED', 'TENANT_REACTIVATED', 'SECURITY_ALERT');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scope" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleScope" (
    "roleId" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleScope_pkey" PRIMARY KEY ("roleId","scopeId")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "type" "SessionType" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "lastActivity" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "reason" "LoginFailReason",
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "actorUserId" TEXT,
    "targetUserId" TEXT,
    "event" "AuditEvent" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APIKey" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_tenantId_email_key" ON "User"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_tenantId_name_key" ON "Role"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Scope_name_key" ON "Scope"("name");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_tenantId_idx" ON "Session"("tenantId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Session_revokedAt_idx" ON "Session"("revokedAt");

-- CreateIndex
CREATE INDEX "Session_revokedBy_idx" ON "Session"("revokedBy");

-- CreateIndex
CREATE INDEX "Session_tenantId_userId_idx" ON "Session"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "Session_tenantId_createdAt_idx" ON "Session"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_tenantId_idx" ON "LoginAttempt"("tenantId");

-- CreateIndex
CREATE INDEX "LoginAttempt_userId_idx" ON "LoginAttempt"("userId");

-- CreateIndex
CREATE INDEX "LoginAttempt_email_idx" ON "LoginAttempt"("email");

-- CreateIndex
CREATE INDEX "LoginAttempt_success_idx" ON "LoginAttempt"("success");

-- CreateIndex
CREATE INDEX "LoginAttempt_createdAt_idx" ON "LoginAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_ipAddress_createdAt_idx" ON "LoginAttempt"("ipAddress", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_idx" ON "AuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_targetUserId_idx" ON "AuditLog"("targetUserId");

-- CreateIndex
CREATE INDEX "AuditLog_event_idx" ON "AuditLog"("event");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_createdAt_idx" ON "AuditLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_event_createdAt_idx" ON "AuditLog"("event", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_event_idx" ON "AuditLog"("tenantId", "event");

-- CreateIndex
CREATE INDEX "APIKey_tenantId_idx" ON "APIKey"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "APIKey_tenantId_name_key" ON "APIKey"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleScope" ADD CONSTRAINT "RoleScope_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleScope" ADD CONSTRAINT "RoleScope_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_revokedBy_fkey" FOREIGN KEY ("revokedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



-- Function to enforce tenant integrity in UserRole
CREATE OR REPLACE FUNCTION enforce_user_role_tenant()
RETURNS TRIGGER AS $$
DECLARE
    user_tenant TEXT;
    role_tenant TEXT;
BEGIN
    -- Fetch tenant of the user
    SELECT "tenantId" INTO user_tenant
    FROM "User"
    WHERE id = NEW."userId";

    -- Fetch tenant of the role
    SELECT "tenantId" INTO role_tenant
    FROM "Role"
    WHERE id = NEW."roleId";

    -- Compare tenants
    IF user_tenant IS NULL OR role_tenant IS NULL THEN
        RAISE EXCEPTION 'UserRole integrity error: user or role does not exist';
    END IF;

    IF user_tenant <> role_tenant THEN
        RAISE EXCEPTION 'UserRole integrity error: user and role belong to different tenants';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT and UPDATE on UserRole
CREATE TRIGGER enforce_user_role_tenant_trigger
BEFORE INSERT OR UPDATE ON "UserRole"
FOR EACH ROW
EXECUTE FUNCTION enforce_user_role_tenant();


-- Function to enforce integrity in RoleScope
CREATE OR REPLACE FUNCTION enforce_role_scope_integrity()
RETURNS TRIGGER AS $$
DECLARE
    role_exists BOOLEAN;
    scope_exists BOOLEAN;
BEGIN
    -- Check if role exists
    SELECT EXISTS(
        SELECT 1 FROM "Role" WHERE id = NEW."roleId"
    ) INTO role_exists;

    IF NOT role_exists THEN
        RAISE EXCEPTION 'RoleScope integrity error: role does not exist';
    END IF;

    -- Check if scope exists
    SELECT EXISTS(
        SELECT 1 FROM "Scope" WHERE id = NEW."scopeId"
    ) INTO scope_exists;

    IF NOT scope_exists THEN
        RAISE EXCEPTION 'RoleScope integrity error: scope does not exist';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT and UPDATE on RoleScope
CREATE TRIGGER enforce_role_scope_integrity_trigger
BEFORE INSERT OR UPDATE ON "RoleScope"
FOR EACH ROW
EXECUTE FUNCTION enforce_role_scope_integrity();

-- Function to enforce tenant integrity in Session
CREATE OR REPLACE FUNCTION enforce_session_tenant_integrity()
RETURNS TRIGGER AS $$
DECLARE
    user_tenant TEXT;
BEGIN
    -- Fetch tenant of the user
    SELECT "tenantId" INTO user_tenant
    FROM "User"
    WHERE id = NEW."userId";

    IF user_tenant IS NULL THEN
        RAISE EXCEPTION 'Session integrity error: user does not exist';
    END IF;

    -- Compare tenants
    IF user_tenant <> NEW."tenantId" THEN
        RAISE EXCEPTION 'Session integrity error: user and session belong to different tenants';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT and UPDATE on Session
CREATE TRIGGER enforce_session_tenant_integrity_trigger
BEFORE INSERT OR UPDATE ON "Session"
FOR EACH ROW
EXECUTE FUNCTION enforce_session_tenant_integrity();

-- Function to enforce tenant integrity in APIKey
CREATE OR REPLACE FUNCTION enforce_apikey_tenant_integrity()
RETURNS TRIGGER AS $$
DECLARE
    tenant_exists BOOLEAN;
BEGIN
    -- Check if tenant exists
    SELECT EXISTS(
        SELECT 1 FROM "Tenant" WHERE id = NEW."tenantId"
    ) INTO tenant_exists;

    IF NOT tenant_exists THEN
        RAISE EXCEPTION 'APIKey integrity error: tenant does not exist';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT and UPDATE on APIKey
CREATE TRIGGER enforce_apikey_tenant_integrity_trigger
BEFORE INSERT OR UPDATE ON "APIKey"
FOR EACH ROW
EXECUTE FUNCTION enforce_apikey_tenant_integrity();

-- Function to auto-revoke sessions when a user is deactivated or soft-deleted
CREATE OR REPLACE FUNCTION auto_revoke_sessions_on_user_deactivation()
RETURNS TRIGGER AS $$
BEGIN
    -- Only act when isActive changes from true to false OR deletedAt becomes non-null
    IF (OLD."isActive" = true AND NEW."isActive" = false)
       OR (OLD."deletedAt" IS NULL AND NEW."deletedAt" IS NOT NULL)
    THEN
        UPDATE "Session"
        SET "revokedAt" = NOW(),
            "revokedBy" = NULL
        WHERE "userId" = NEW."id"
          AND "revokedAt" IS NULL; -- only active sessions
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for User deactivation and soft-deletes
CREATE TRIGGER auto_revoke_sessions_on_user_deactivation_trigger
AFTER UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION auto_revoke_sessions_on_user_deactivation();


-- Function to auto-revoke all sessions when a tenant is suspended
CREATE OR REPLACE FUNCTION auto_revoke_sessions_on_tenant_suspension()
RETURNS TRIGGER AS $$
BEGIN
    -- Only act when isActive changes from true to false
    IF OLD."isActive" = true AND NEW."isActive" = false THEN
        UPDATE "Session"
        SET "revokedAt" = NOW(),
            "revokedBy" = NULL
        WHERE "tenantId" = NEW."id"
          AND "revokedAt" IS NULL; -- only active sessions
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Tenant suspension
CREATE TRIGGER auto_revoke_sessions_on_tenant_suspension_trigger
AFTER UPDATE ON "Tenant"
FOR EACH ROW
EXECUTE FUNCTION auto_revoke_sessions_on_tenant_suspension();

-- Function to auto-invalidate API keys when a tenant is suspended
CREATE OR REPLACE FUNCTION auto_invalidate_apikeys_on_tenant_suspension()
RETURNS TRIGGER AS $$
BEGIN
    -- Only act when isActive changes from true to false
    IF OLD."isActive" = true AND NEW."isActive" = false THEN
        UPDATE "APIKey"
        SET "hash" = 'revoked_' || "hash"
        WHERE "tenantId" = NEW."id";
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Tenant suspension
CREATE TRIGGER auto_invalidate_apikeys_on_tenant_suspension_trigger
AFTER UPDATE ON "Tenant"
FOR EACH ROW
EXECUTE FUNCTION auto_invalidate_apikeys_on_tenant_suspension();


-- Function to prevent changes on a user's tenant
CREATE OR REPLACE FUNCTION prevent_user_tenant_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If tenantId changes, block the update
    IF OLD."tenantId" <> NEW."tenantId" THEN
        RAISE EXCEPTION 'User tenantId is immutable and cannot be changed';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to block tenant changes on User
CREATE TRIGGER prevent_user_tenant_change_trigger
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION prevent_user_tenant_change();

-- Function to prevent changes on a role's tenant
CREATE OR REPLACE FUNCTION prevent_role_tenant_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If tenantId changes, block the update
    IF OLD."tenantId" <> NEW."tenantId" THEN
        RAISE EXCEPTION 'Role tenantId is immutable and cannot be changed';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to block tenant changes on Role
CREATE TRIGGER prevent_role_tenant_change_trigger
BEFORE UPDATE ON "Role"
FOR EACH ROW
EXECUTE FUNCTION prevent_role_tenant_change();

-- Function to prevent changes on a apikey's tenant
CREATE OR REPLACE FUNCTION prevent_apikey_tenant_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If tenantId changes, block the update
    IF OLD."tenantId" <> NEW."tenantId" THEN
        RAISE EXCEPTION 'APIKey tenantId is immutable and cannot be changed';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to block tenant changes on APIKey
CREATE TRIGGER prevent_apikey_tenant_change_trigger
BEFORE UPDATE ON "APIKey"
FOR EACH ROW
EXECUTE FUNCTION prevent_apikey_tenant_change();


-- Function to prevent changes on a session's tenant
CREATE OR REPLACE FUNCTION prevent_session_tenant_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If tenantId changes, block the update
    IF OLD."tenantId" <> NEW."tenantId" THEN
        RAISE EXCEPTION 'Session tenantId is immutable and cannot be changed';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to block tenant changes on Session
CREATE TRIGGER prevent_session_tenant_change_trigger
BEFORE UPDATE ON "Session"
FOR EACH ROW
EXECUTE FUNCTION prevent_session_tenant_change();


-- Function to prevent renaming a Scope if it is already in use
CREATE OR REPLACE FUNCTION prevent_scope_rename_if_in_use()
RETURNS TRIGGER AS $$
DECLARE
    usage_count INTEGER;
BEGIN
    -- Only act when name changes
    IF OLD."name" <> NEW."name" THEN
        -- Count how many RoleScope entries reference this scope
        SELECT COUNT(*) INTO usage_count
        FROM "RoleScope"
        WHERE "scopeId" = OLD."id";

        IF usage_count > 0 THEN
            RAISE EXCEPTION 'Scope name cannot be changed because it is already assigned to roles';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for UPDATE on Scope
CREATE TRIGGER prevent_scope_rename_if_in_use_trigger
BEFORE UPDATE ON "Scope"
FOR EACH ROW
EXECUTE FUNCTION prevent_scope_rename_if_in_use();


-- Function to prevent changes on a tenant's slug if it has users
CREATE OR REPLACE FUNCTION prevent_tenant_slug_change_if_in_use()
RETURNS TRIGGER AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Only act when slug changes
    IF OLD."slug" <> NEW."slug" THEN
        -- Count how many users belong to this tenant
        SELECT COUNT(*) INTO user_count
        FROM "User"
        WHERE "tenantId" = OLD."id";

        IF user_count > 0 THEN
            RAISE EXCEPTION 'Tenant slug cannot be changed because the tenant already has users';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to block updates on user bearing tenant's slug
CREATE TRIGGER prevent_tenant_slug_change_if_in_use_trigger
BEFORE UPDATE ON "Tenant"
FOR EACH ROW
EXECUTE FUNCTION prevent_tenant_slug_change_if_in_use();


-- Indestructible tenants
CREATE OR REPLACE FUNCTION prevent_tenant_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Tenants cannot be deleted. Use isActive instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_tenant_delete_trigger
BEFORE DELETE ON "Tenant"
FOR EACH ROW
EXECUTE FUNCTION prevent_tenant_delete();


-- Indestructible users
CREATE OR REPLACE FUNCTION prevent_user_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Users cannot be deleted. Use isActive instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_user_delete_trigger
BEFORE DELETE ON "User"
FOR EACH ROW
EXECUTE FUNCTION prevent_user_delete();


-- Indestructible roles
CREATE OR REPLACE FUNCTION prevent_role_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Roles cannot be deleted. Use isActive instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_role_delete_trigger
BEFORE DELETE ON "Role"
FOR EACH ROW
EXECUTE FUNCTION prevent_role_delete();


-- Indestructible scopes
CREATE OR REPLACE FUNCTION prevent_scope_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Scopes cannot be deleted. Use isActive instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_scope_delete_trigger
BEFORE DELETE ON "Scope"
FOR EACH ROW
EXECUTE FUNCTION prevent_scope_delete();


-- Indestructible API keys
CREATE OR REPLACE FUNCTION prevent_apikey_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'API keys cannot be deleted. Revoke them instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_apikey_delete_trigger
BEFORE DELETE ON "APIKey"
FOR EACH ROW
EXECUTE FUNCTION prevent_apikey_delete();


-- Indestructible sessions
CREATE OR REPLACE FUNCTION prevent_session_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Sessions cannot be deleted. Use revokedAt instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_session_delete_trigger
BEFORE DELETE ON "Session"
FOR EACH ROW
EXECUTE FUNCTION prevent_session_delete();


-- Indestructible login attempts
CREATE OR REPLACE FUNCTION prevent_loginattempt_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Login attempts cannot be deleted. They are part of security audit.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_loginattempt_delete_trigger
BEFORE DELETE ON "LoginAttempt"
FOR EACH ROW
EXECUTE FUNCTION prevent_loginattempt_delete();


-- Indestructible audit logs
CREATE OR REPLACE FUNCTION prevent_auditlog_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs cannot be deleted. They are required for compliance.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_auditlog_delete_trigger
BEFORE DELETE ON "AuditLog"
FOR EACH ROW
EXECUTE FUNCTION prevent_auditlog_delete();


