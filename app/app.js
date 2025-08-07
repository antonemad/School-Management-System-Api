const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const adminRouter = require("../routes/staff/adminRouter");
const academicYearRouter = require("../routes/academic/academicYearRouter");
const academicTermsRouter = require("../routes/academic/academicTermRouter");
const classLevelRouter = require("../routes/academic/classLevelRouter");
const programRouter = require("../routes/academic/programRouter");
const subjectRouter = require("../routes/academic/subjectRouter");
const yearGroupRouter = require("../routes/academic/yearGroupRouter");
const teacherRouter = require("../routes/staff/teacherRouter");
const examRouter = require("../routes/academic/examRouter");
const studentRouter = require("../routes/Student/studentRouter");
const questionRouter = require("../routes/academic/questionRouter");
const examResultsRouter = require("../routes/Student/examResultsRouter");

const notFoundMiddleware = require("../middlewares/not-found");
const errorHandlerMiddleware = require("../middlewares/error-handler");

const app = express();

//-----------middlewares------------------
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_KEY));

//-----------routes-----------------------
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermsRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/exam-results", examResultsRouter);

//-----------Error Middlewares ------------
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); 

module.exports = app;
