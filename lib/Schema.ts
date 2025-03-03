const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  records: { type: Map, of: String } // Maps subjects to "present" or "absent"
});

const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  schedule: { type: Map, of: String } // Maps time slots to subjects
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  timetableUploaded: { type: Boolean, default: false },
  timetable: [timetableSchema],
  attendance: [attendanceSchema],
}, { timestamps: true });

 export const User = mongoose.model('User', userSchema);
