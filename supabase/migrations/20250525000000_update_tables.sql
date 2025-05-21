
-- Add photos column to reports table
ALTER TABLE IF EXISTS public.reports
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT NULL;

-- Add email field to contacts
ALTER TABLE IF EXISTS public.contacts
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT NULL;

-- Add is_emergency_contact field to contacts
ALTER TABLE IF EXISTS public.contacts
ADD COLUMN IF NOT EXISTS is_emergency_contact BOOLEAN DEFAULT FALSE;

-- Add blood_type to profiles
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS blood_type TEXT DEFAULT NULL;

-- Create storage bucket for report photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('report-photos', 'Report Photos', true, 10485760, '{image/*}')
ON CONFLICT (id) DO NOTHING;

-- Set up public storage policies for the report-photos bucket
DO $$
BEGIN
  -- Insert policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies
    WHERE name = 'Public Report Photos Policy'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    VALUES
      ('Public Report Photos Select', 'report-photos', 'SELECT', '{"bucket_id":"report-photos"}'),
      ('Authenticated Insert Report Photos', 'report-photos', 'INSERT', '{"bucket_id":"report-photos","auth.uid":storage.foldername(name)[1]}'),
      ('Owner Delete Report Photos', 'report-photos', 'DELETE', '{"bucket_id":"report-photos","auth.uid":storage.foldername(name)[1]}');
  END IF;
END
$$;
