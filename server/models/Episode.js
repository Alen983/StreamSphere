const episodeSchema = new Schema({
  series_id: {
    type: Schema.Types.ObjectId,
    ref: "Series",
    required: true
  },
  season_id: {
    type: Schema.Types.ObjectId,
    ref: "Season",
    required: true
  },

  episode_name: String,
  episode_number: Number,
  duration: Number, // in minutes
  air_date: Date,

  thumbnail_url: String,
  episode_video_url: String
});
