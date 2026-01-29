class Favorite {
    constructor({ id, user_id, video_id, title, thumbnail_url, position, created_at }) {
        this.id = id;
        this.user_id = user_id;
        this.video_id = video_id;
        this.title = title;
        this.thumbnail_url = thumbnail_url;
        this.position = position ?? 0;
        this.created_at = created_at;
    }
}

module.exports = Favorite;
