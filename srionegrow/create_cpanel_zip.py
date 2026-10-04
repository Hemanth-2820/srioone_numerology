import os
import zipfile

workspace = r"c:\Users\DELL\Documents\srioone_numerology\srionegrow"
dist_dir = os.path.join(workspace, "dist")
backend_dir = os.path.join(workspace, "backend")
output_zip = os.path.join(workspace, "srionegrow_cpanel_upload.zip")

def add_folder_to_zip(zip_file, folder_path, arcname_prefix=""):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, folder_path)
            arcname = os.path.join(arcname_prefix, rel_path)
            zip_file.write(file_path, arcname)

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    if os.path.exists(dist_dir):
        add_folder_to_zip(zipf, dist_dir, arcname_prefix="")
    if os.path.exists(backend_dir):
        add_folder_to_zip(zipf, backend_dir, arcname_prefix="backend")

print(f"Successfully created {output_zip} for cPanel!")
