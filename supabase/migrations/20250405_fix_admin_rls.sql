
-- Create a function to disable RLS on admin_users
CREATE OR REPLACE FUNCTION public.disable_rls_for_admin_users() 
RETURNS void AS $$
BEGIN
    -- Disable RLS on admin_users table
    EXECUTE 'ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to service role
GRANT EXECUTE ON FUNCTION public.disable_rls_for_admin_users() TO service_role;

-- Execute the function immediately
SELECT public.disable_rls_for_admin_users();
