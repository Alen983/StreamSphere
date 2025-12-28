const seasonSchema = new Schema({
  series_id: {
    type: Schema.Types.ObjectId,
    ref: "Series",
    required: true
  },
  season_number: Number,
  release_date: Date
});
