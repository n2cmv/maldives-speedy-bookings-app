
-- Create a function to verify OTPs in a type-safe way
CREATE OR REPLACE FUNCTION public.verify_booking_otp(user_email TEXT, code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  otp_valid BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.booking_otps
    WHERE email = user_email
      AND otp_code = code
      AND expires_at > NOW()
  ) INTO otp_valid;

  RETURN otp_valid;
END;
$$;

-- Grant execute permissions to this function
GRANT EXECUTE ON FUNCTION public.verify_booking_otp(TEXT, TEXT) TO service_role, anon;
