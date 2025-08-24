# Compute module

Purpose
- Creates a single EC2 instance (Ubuntu) and assigns an Elastic IP.

When to edit
- Change `instance_type` for performance testing.
- Adjust `root_block_device` for disk size experiments.

Learning tips
- Inspect `user_data` (cloud-init) to learn how instances bootstrap
  themselves. Try adding a simple command (e.g., `echo hello > /tmp/hello`) and
  re-create the instance to observe the change in `/var/log/cloud-init-output.log`.
