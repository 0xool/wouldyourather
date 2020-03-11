import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "kodoomesh.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 2000000;
const questionDataJSON = require('./questions.json');


export default class Database {
   
  



   
    initDB(databaseLoadingComplete) {
      console.log(questionDataJSON.length)
        let db;
        return new Promise((resolve) => {
            
          console.log("Plugin integrity check ...");
          SQLite.echoTest()
            .then(() => {
              console.log("Integrity check passed ...");
              console.log("Opening database ...");
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {                  
                  db = DB;
                  console.log("Database OPEN");
                  db.executeSql('SELECT 1 FROM Question LIMIT 1').then(() => {
                      console.log("Database is ready ... executing query ...");
                      databaseLoadingComplete()
                  }).catch((error) =>{
                      console.log("Received error: ", error);
                      console.log("Database not yet ready ... populating data");
                      db.transaction((tx) => {
                          tx.executeSql('CREATE TABLE IF NOT EXISTS Question (questionId primary key, firstQuestion, secondQuestion,firstQuestionVoteNumber INTEGER,secondQuestionVoteNumber INTEGER, voted INTEGER)');
                          for (var i = 0;i < questionDataJSON.length;i++){                                                                              
                            let q = {
                                
                                questionId: questionDataJSON[i].questionId,
                                firstQuestion: questionDataJSON[i].firstQuestion,
                                secondQuestion: questionDataJSON[i].secondQuestion,
                                firstQuestionVoteNumber: questionDataJSON[i].firstQuestionVoteNumber,
                                secondQuestionVoteNumber: questionDataJSON[i].secondQuestionVoteNumber,
                                voted : 0                  
                            }
                            tx.executeSql('INSERT INTO Question VALUES (?, ?, ?, ?, ? ,? )', [q.questionId, q.firstQuestion, q.secondQuestion, q.firstQuestionVoteNumber, q.secondQuestionVoteNumber,q.voted])
                          } 
                      }).then((tx,result) => {
                          console.log("Table created successfully");        
                          databaseLoadingComplete()
                                                       
                      }).catch(error => {
                          console.log(error);
                      })
                  });
                  resolve(db);
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {                
              console.log("echoTest failed - plugin not functional");
            });
          });
      };

      closeDatabase(db) {
        if (db) {
          console.log("Closing DB");
          db.close()
            .then(status => {
              console.log("Database CLOSED");
            })
            .catch(error => {
              this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
      }

      listQuestions() {
        
        return new Promise((resolve) => {
          const questions = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT q.questionId,q.firstQuestion, q.secondQuestion,q.firstQuestionVoteNumber,q.secondQuestionVoteNumber,q.voted FROM Question q', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  const questionId = JSON.stringify(row.questionId)
                  const firstQuestion = JSON.stringify(row.firstQuestion)
                  const secondQuestion = JSON.stringify(row.secondQuestion)
                  const firstQuestionVoteNumber = JSON.stringify(row.firstQuestionVoteNumber)
                  const secondQuestionVoteNumber = JSON.stringify(row.secondQuestionVoteNumber)
                  questions.push({
                    questionId, 
                    firstQuestion ,
                    secondQuestion ,
                    firstQuestionVoteNumber,
                    secondQuestionVoteNumber 
                  });
                }
                resolve(questions);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      listUnvotedQuestions() {
        
        return new Promise((resolve) => {
          const questions = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT q.questionId,q.firstQuestion, q.secondQuestion,q.firstQuestionVoteNumber,q.secondQuestionVoteNumber,q.voted FROM Question q WHERE voted = 0', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  const {  firstQuestion , secondQuestion , firstQuestionVoteNumber, secondQuestionVoteNumber,voted } = row;
                  const questionId = row.questionId.toString()
                  questions.push({
                    questionId, 
                    firstQuestion ,
                    secondQuestion ,
                    firstQuestionVoteNumber,
                    secondQuestionVoteNumber,
                    voted 
                  });
                }
                resolve(questions);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      addQuestion(q) {        
        return new Promise((resolve) => {
            
          this.initDB().then((db) => {
            
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO Question VALUES (?, ?, ?, ?, ? ,? )', [q.questionId, q.firstQuestion, q.secondQuestion, q.firstQuestionVoteNumber, q.secondQuestionVoteNumber,q.voted]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      questionExists(id) {        
        return new Promise((resolve) => {
            
          this.initDB().then((db) => {
            
            db.transaction((tx) => {
              tx.executeSql('SELECT EXISTS(SELECT 1 FROM Question WHERE questionId=? )', [id]).then(([tx, results]) => {
                console.log(`look here bitch :D ${results.rows[0]}`)
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      deleteQuestion(id) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('DELETE FROM Question WHERE questionId = ?', [id]).then(([tx, results]) => {
                console.log(results);
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      updateQuestionVoteNumber(id, question) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('UPDATE Question SET firstQuestionVoteNumber = ? , secondQuestionVoteNumber = ?,voted = ? WHERE questionId = ?', [question.firstQuestionVoteNumber, question.secondQuestionVoteNumber, 1 ,question.questionId,]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      updateQuestionVoteNumberForServerUpdate(id, question) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('UPDATE Question SET firstQuestionVoteNumber = ? , secondQuestionVoteNumber = ?,voted = ? WHERE questionId = ?', [question.firstQuestionVoteNumber, question.secondQuestionVoteNumber, 0 ,question.questionId,]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }
}