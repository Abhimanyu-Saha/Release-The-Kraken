CREATE INDEX IF NOT EXISTS idx_releases_status ON releases(status);
CREATE INDEX IF NOT EXISTS idx_releases_published_at ON releases(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_ack_client_id ON release_acknowledgements(client_id);
CREATE INDEX IF NOT EXISTS idx_ack_release_id ON release_acknowledgements(release_id);
CREATE INDEX IF NOT EXISTS idx_release_content_release_id ON release_content(release_id);
