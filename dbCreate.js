// Open or create the database
const db = SQLite.openDatabase('whiteboard.db');

// SQLite for React Native Expo
db.transaction(tx => {
    tx.executeSql(
        `CREATE TABLE IF NOT EXISTS wbposts (
            pid INTEGER PRIMARY KEY AUTOINCREMENT,
            wid INTEGER,
            respto INTEGER,
            title TEXT,
            content TEXT,
            image BLOB,
            imgurl VARCHAR(255),
            data TEXT,
            style TINYINT,
            coordinates VARCHAR(255),
            created DATETIME DEFAULT CURRENT_TIMESTAMP,
            changed DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      );
});