import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Reactoffline.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;
const questionDataJSON = require('./questions.json');


export default class Database {
   
  

    importTest () {

        config_database = SQLite.openDatabase({name : "testDB", createFromLocation : 1}, () => {console.log('maybe just maybe')},() => {console.log('error')});
        let mainDb = 
        SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size
          )
            .then(DB => {
                console.log('close but not too close')
                DB.attach('testDB',database_name, () => {console.log('attached'), () => {console.log('denied')}})
            }).catch(err => {console.log(err)})

    }


   
    initDB(finishedLoading) {
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
                      
                  }).catch((error) =>{
                      console.log("Received error: ", error);
                      console.log("Database not yet ready ... populating data");
                      db.transaction((tx) => {
                          tx.executeSql('CREATE TABLE IF NOT EXISTS Question (questionId, firstQuestion, secondQuestion,firstQuestionVoteNumber INTEGER,secondQuestionVoteNumber INTEGER)');
                      }).then(() => {
                          console.log("Table created successfully");        
                          for (var i = 0;i < questionDataJSON.length;i++){                                                                              
                            let data = {
                                questionId: questionDataJSON[i].questionId,
                                firstQuestion: questionDataJSON[i].firstQuestion,
                                secondQuestion: questionDataJSON[i].secondQuestion,
                                firstQuestionVoteNumber: questionDataJSON[i].firstQuestionVoteNumber,
                                secondQuestionVoteNumber: questionDataJSON[i].secondQuestionVoteNumber
                            }
                            this.addQuestion(data).then((result) => {
                                console.log('result')
                                console.log(result);
                                
                            }).catch((err) => {
                                console.log('error')
                                console.log(err);
                            })
                          } 
                                                       
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
              tx.executeSql('SELECT q.questionId,q.firstQuestion, q.secondQuestion,q.firstQuestionVoteNumber,q.secondQuestionVoteNumber FROM Question q', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  console.log(`Quesiton ID: ${row.quetionId}`)
                  const { questionId, firstQuestion , secondQuestion , firstQuestionVoteNumber, secondQuestionVoteNumber } = row;
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

      addQuestion(q) {
        
        return new Promise((resolve) => {
            
          this.initDB().then((db) => {
            
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO Question VALUES (?, ?, ?, ?, ?)', [q.questionId, q.firstQuestion, q.secondQuestion, q.firstQuestionVoteNumber, q.secondQuestionVoteNumber]).then(([tx, results]) => {
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
              tx.executeSql('UPDATE Question SET firstQuestionVoteNumber = ? , secondQuestionVoteNumber = ? WHERE questionId = ?', [question.firstQuestionVoteNumber, question.secondQuestionVoteNumber, question.questionId]).then(([tx, results]) => {
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