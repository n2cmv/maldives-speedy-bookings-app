
-- Create a function to disable RLS on admin_users if needed
CREATE OR REPLACE FUNCTION public.disable_rls_for_admin_users_if_needed() 
RETURNS void AS $$
DECLARE 
    rls_enabled BOOLEAN;
BEGIN
    -- Check if RLS is enabled on admin_users
    SELECT relrowsecurity INTO rls_enabled 
    FROM pg_class 
    WHERE oid = 'public.admin_users'::regclass;
    
    -- Disable RLS if it's enabled
    IF rls_enabled THEN
        EXECUTE 'ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.disable_rls_for_admin_users_if_needed() TO service_role;
