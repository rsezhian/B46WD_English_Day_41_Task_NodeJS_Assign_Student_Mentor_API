//
const express = require("express");
const {
  MentorSchema,
  StudentSchema,
} = require("../schemas/studentmentorSchema.js");
const router = new express.Router();
//
//
// connection to home page
router.get("/", async (req, res) => {
  return res.send("Welcome HomePage for Assigning Student Mentor API");
});

// create a mentor
router.post("/creatementor", async (req, res) => {
  let mentor_name = req.body.mentor_name;
  let mentor_email = req.body.mentor_email;
  try {
    let mentor = await MentorSchema.findOne({ mentor_email: mentor_email });
    if (mentor) {
      return res.status(400).json({ error: "mentor email already available" });
    }
    const add_mentor = await new MentorSchema({
      mentor_name: mentor_name,
      mentor_email: mentor_email,
    });
    let saved_mentor = await add_mentor.save();
    return res.status(200).json(saved_mentor);
  } catch (error) {
    res.status(400).json({ error: "some error occured" });
  }
});

// create a student
router.post("/createstudent", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  try {
    let student = await StudentSchema.findOne({ email: email });
    if (student) {
      return res.status(400).json({ error: "student email already available" });
    }
    const add_student = await new StudentSchema({
      name: name,
      email: email,
    });
    let saved_student = await add_student.save();
    return res.status(200).json(saved_student);
  } catch (error) {
    res.status(400).json({ error: "some error occured" });
  }
});

// assign student to a mentor
router.post("/addstudent/:mentor_id", async (req, res) => {
  const mentor_id = req.params.mentor_id;
  const student_list = req.body.student;
  try {
    const mentor = await MentorSchema.findOne({ _id: mentor_id });
    if (!mentor) {
      return res.status(400).json({ error: "no such mentor id exists !!!" });
    }
    console.log(student_list);
    await StudentSchema.updateMany(
      { _id: { $in: student_list } },
      {
        $set: { mentor: mentor_id },
        $addToSet: { mentorlist: mentor_id },
      },
      { returnDocument: "after" }
    ).then(() => {
      StudentSchema.find({ mentor: mentor_id }).then((student) => {
        return res.status(200).json(student);
      });
    });
  } catch (error) {
    res.status(400).json({ error: "some error occured" });
  }
});

// assign mentor to a student
router.post("/:student_id/addmentor/:mentor_id", async (req, res) => {
  const student_id = req.params.student_id;
  const mentor_id = req.params.mentor_id;
  const check_student = await StudentSchema.findById(student_id);
  const check_mentor = await MentorSchema.findById(mentor_id);
  try {
    if (!check_student || !check_mentor) {
      return res
        .status(400)
        .json({ error: "please check the student or mentor id !!!" });
    }
    const selected_mentor = await StudentSchema.findByIdAndUpdate(
      student_id,
      {
        $set: {
          mentor: mentor_id,
        },
        $addToSet: {
          mentorlist: mentor_id,
        },
      },
      { returnDocument: "after" }
    );
    res.status(200).json(selected_mentor);
  } catch (error) {
    res.status(400).json({ error: "some error occured" });
  }
});

// get student of particular mentor
router.get("/getstudentwithmentor/:mentor_id", async (req, res) => {
  let mentor_id = req.params.mentor_id;
  const check_mentor = await MentorSchema.findById(mentor_id);
  try {
    if (!check_mentor) {
      return res.status(400).json({ error: "please check the mentor ID" });
    }
    const selected_Students = await StudentSchema.find({ mentor: mentor_id });
    if (selected_Students.length === 0) {
      return res.status(400).json({ message: "no student found !!!" });
    } else {
      return res.status(200).json(selected_Students);
    }
  } catch (error) {
    res.status(400).json({ error: "something went wrong !!!" });
  }
});

// get mentor of particular student
router.get("/getmentorwithstudent/:student_id", async (req, res) => {
  const student_id = req.params.student_id;
  try {
    const selected_students = await StudentSchema.findById(student_id);
    console.log(`selected_students: ${selected_students}`);
    if (!selected_students) {
      return res.status(200).end("check the student id !!!");
    }
    return res.status(200).json(selected_students.mentorlist);
  } catch (error) {
    res.status(400).json({ error: "some error has occurred" });
  }
});

//
//
//
//
//
module.exports = router;
