let express = require("express");
let app = express();
let db = require("./db");
let bodyParser = require("body-parser");
let path = require("path");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public',express.static("public"));


//  Nav page
app.get("/", (req, res) => {
    res.render("nav.ejs");
});

// Define the route for the new course page
app.get('/newcourse', (req, res) => {
    res.render('newcourse.ejs',{msg:""});  // This will render the newcourse.ejs page
});

app.get("/newstudent", (req, res) => {
    db.query("SELECT * FROM courses", (err, result) => {
        if (err) {
            console.error(err);
            return res.render("newstudent", { data: [], msg: "Error loading courses" });
        }
        res.render("newstudent", { data: result, msg: null });
    });
});

//  View students
app.get("/viewstudent", (req, res) => {
    db.query(`
        SELECT 
          s.sid,
          s.name AS studentName,
          s.email,
          s.contact,
          c.name AS courseName 
        FROM courses c 
        JOIN student s ON s.courseid = c.courseid
      `, (err, result) => {
          if (err) {
              console.error(err);
              return res.render("viewstudent.ejs", { data: [] });
          }
          res.render("viewstudent.ejs", { data: result });
      });
      
});

//  View courses
app.get("/viewcourse", (req, res) => {
    db.query("SELECT * FROM courses", (err, results) => {
        if (err) {
            console.error(err);
            return res.render("viewcourse.ejs", { data: [] });
        }
        res.render("viewcourse.ejs", { data: results });
    });

  
 });

//update course
app.get('/updatecoursebyid', (req, res) => {
    const id = req.query.courseid;
    db.query('SELECT * FROM courses WHERE courseid = ?', [id], (err, result) => {
        if (err) throw err;
        res.render('update.ejs', { data: result }); // send as array

    });
});

app.post("/update", (req, res) => {
    let { sid, name, email, contact, courseid } = req.body;

    // Ensure numeric types for sid and courseid
    sid = parseInt(sid);
    courseid = parseInt(courseid);

    console.log("Received Update Data:", { sid, name, email, contact, courseid });

    // Update the student with the new data
    db.query(
        "UPDATE student SET name = ?, email = ?, contact = ?, courseid = ? WHERE sid = ?",
        [name, email, contact, courseid, sid],
        (err, updateResult) => {
            if (err) {
                console.error("Update error:", err);
                return res.send("Error during student update");
            }

            console.log("Update successful:", updateResult);

            // Fetch the updated list of students
            db.query(
                "SELECT s.sid, s.name as studentName, s.email, s.contact, c.name AS courseName FROM student s JOIN courses c ON s.courseid = c.courseid",
                (err2, result) => {
                    if (err2) {
                        console.error("Error fetching student list:", err2);
                        return res.render("viewstudent.ejs");
                    }

                    // Render the updated student list
                    res.render("viewstudent.ejs", { data: result });
                }
            );
        }
    );
});



app.get("/updatestudent", (req, res) => {
    let sid = parseInt(req.query.sid);
    console.log("Fetching student with SID:", sid); // ADD THIS

    db.query("SELECT s.sid, s.name as studentName, s.email, s.contact, s.courseid, c.name FROM student s JOIN courses c ON c.courseid = s.courseid WHERE s.sid = ?", [sid], (err, result) => {
        console.log("Student record result:", result); // ADD THIS

        if (err) return res.send("Error fetching student");
        if (result.length === 0) return res.send("No student found with this ID");

        db.query("SELECT * FROM courses", (err2, courses) => {
            if (err2) return res.send("Error fetching courses");
            res.render("updateStud.ejs", { erecord: result, data: courses });
        });
    });
});






//update course post
app.post("/updatecourse",(req,res)=>{
    let name=req.body.name;
    let courseid=req.body.courseid;
    
    db.query("update courses set name=? where courseid=?",[name,courseid],(err,result)=>{});
    db.query("select *from courses",(err,result)=>{
        if(err){
            res.render("viewcourse.ejs");
        }
        else{
           res.render("viewcourse.ejs",{data:result});
        }
    });
});


//coursewise stud list
app.get("/coursewise", (req, res) => {
    db.query("SELECT * FROM courses", (err, results) => {
        if (err) {
            console.error(err);
            return res.render("studentlist.ejs", { data1: [] });
        }
        res.render("studentlist.ejs", { data1: results ,data :[] });
    });
});

//student dat fetching for same course
app.post("/studlist", (req, res) => {
    let selectcourse = req.body.name;
    db.query("SELECT * FROM courses", (err, results) => {
    db.query(
        "SELECT s.sid, s.name, s.email, s.contact FROM student s JOIN courses c ON s.courseid = c.courseid WHERE c.name = ?",
        [selectcourse],
        (err, result2) => {
            if (err) {
                console.error("SQL error:", err);
                res.render("studentlist.ejs", { data: [] }); // or handle error appropriately
            } else {
                res.render("studentlist.ejs", { data1:results ,data:result2});
            }
        }
    );
});
});


//  Save course
app.post("/book", (req, res) => {
    let { name } = req.body;
    db.query("INSERT INTO courses VALUES (0, ?)", [name], (err, result) => {
        if (err) {
            console.error(err);
            return res.render("newcourse.ejs", { msg: "Error adding course" });
        }
        res.render("newcourse.ejs", { msg: "Course added successfully" });
    });
});

//  Save student
app.post("/save", (req, res) => {
    let { name, email, contact, courseid } = req.body;
    db.query("INSERT INTO student VALUES (0, ?, ?, ?, ?)", [name, email, contact, courseid], (err, result) => {
        db.query("SELECT * FROM courses", (err2, result2) => {
            if (err2) {
             res.render("newstudent", { data: [], msg: "Error fetching courses" });
            }
            res.render("newstudent", { data: result2, msg: "Student added successfully" });
        });
    });
});







//  Delete student by ID
app.get("/deletestudbyid", (req, res) => {
    let sid = parseInt(req.query.sid);

    if (!sid || isNaN(sid)) {
        return res.render("viewstudent.ejs", { data: [], error: "Invalid student ID" });
    }

    // First, delete the student
    db.query("DELETE FROM student WHERE sid = ?", [sid], (err, result) => {
        if (err) {
            console.error("Delete failed:", err);
            return res.render("viewstudent.ejs", { data: [], error: "Failed to delete student." });
        }

        // After deleting the student, fetch the student data and the course names for the remaining students
        db.query(`
            SELECT s.sid, s.name AS studentName, s.email, s.contact, c.name AS courseName
            FROM student s
            LEFT JOIN courses c ON s.courseid = c.courseid
        `, (err2, result2) => {
            if (err2) {
                console.error("Fetch failed:", err2);
                return res.render("viewstudent.ejs", { data: [], error: "Failed to fetch student data." });
            }

            res.render("viewstudent.ejs", { data: result2 });
        });
    });
});


//  Delete course by id
app.get("/deletecoursebyid", (req, res) => {
    let courseid = parseInt(req.query.courseid);

    db.query("DELETE FROM courses WHERE courseid=?", [courseid], (err, result) => {});

    db.query("SELECT * FROM courses", (err2, result2) => {
        if (err2) {
            res.render("viewcourse.ejs", { data: [] });
        } else {
            res.render("viewcourse.ejs", { data: result2 });
        }
    });
});


//  Search course by name (AJAX)
app.get("/search", (req, res) => {
    let sname = req.query.sd || "";
    db.query("SELECT * FROM courses WHERE name LIKE ?", [`%${sname}%`], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json([]);
        }
        res.json(result);
    });
});

// app.get("/searchStudent",(req,res)=>{
//     let sname = req.query.sname;
//     db.query("select s.sid,s.sname,s.semail,s.scontact,c.cname from student s join course c on s.cid=c.cid where sname like ? OR semail like ? OR cname like ?",[%${sname}%,%${sname}%,%${sname}%],(err,result)=>{
//         if(err){
//             console.log("Some problem!!!",err);
//         }
//         else{
//             res.json(result)
//         }
//     });
// });
//search for student
app.get("/searchstudent", (req, res) => {
    let searchTerm = req.query.sd;
    db.query(`
        // SELECT s.sid, s.name, s.email, s.contact, c.courseid 
        // FROM student s 
        // JOIN courses c ON s.courseid = c.courseid 
        // WHERE s.name LIKE ?`,
        // [`%${searchTerm}%`], 
        "select s.sid,s.name,s.email,s.contact,c.cname from student s join course c on s.cid=c.cid where sname like ? OR semail like ? OR cname like ?",[%${sname}%,%${sname}%,%${sname}%],
        (err, results) => {
            if (err) return res.status(500).send("Server Error");
            res.json(results);
        }
    );
});



//student count coursewise
app.get("/studentcoursecount", (req, res) => {
    const courseQuery = "SELECT * FROM courses";
    const countQuery = `
        SELECT c.name AS course_name, COUNT(s.sid) AS student_count
        FROM courses c
        LEFT JOIN student s ON c.courseid = s.courseid
        GROUP BY c.courseid
    `;

    db.query(courseQuery, (err, courses) => {
        if (err) {
            console.error("Error fetching courses:", err);
            return res.render("studentcoursecount.ejs", { data1: [], data: [] });
        }

        db.query(countQuery, (err, counts) => {
            if (err) {
                console.error("Error fetching counts:", err);
                return res.render("studentcoursecount.ejs", { data1: courses, data: [] });
            }

            res.render("studentcoursecount.ejs", { data1: courses, data: counts });
        });
    });
});
app.post("/studcount", (req, res) => {
    const selectedCourseName = req.body.name;

    const courseQuery = "SELECT * FROM courses";
    const countQuery = `
        SELECT c.name AS course_name, COUNT(s.sid) AS student_count
        FROM courses c
        LEFT JOIN student s ON c.courseid = s.courseid
        WHERE c.name = ?
        GROUP BY c.courseid
    `;

    db.query(courseQuery, (err, courses) => {
        if (err) {
            console.error("Error fetching courses:", err);
            return res.render("studentcoursecount.ejs", { data1: [], data: [] });
        }

        db.query(countQuery, [selectedCourseName], (err, result) => {
            if (err) {
                console.error("Error fetching count:", err);
                return res.render("studentcoursecount.ejs", { data1: courses, data: [] });
            }

            res.render("studentcoursecount.ejs", { data1: courses, data: result });
        });
    });
});



app.listen(3000, () => {
    console.log("Server started on port 3000");
});
