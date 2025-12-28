const CWSchema = new Schema({ 
 users_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  _id: {
    type: Schema.Types.ObjectId,
    ref: "",
    required: true
  },
}); 