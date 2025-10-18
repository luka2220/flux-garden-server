package db_utils

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

// Sqlite connection pooling

type connPoolOps interface {
	Checkout() *sql.DB    // checkout a db connection
	Checkin(conn *sql.DB) // checkin a db connection
}

type dbConn struct {
	connPoolOps
	connections chan *sql.DB
}

func (db *dbConn) Checkout() *sql.DB {
	return <-db.connections
}

func (db *dbConn) Checkin(conn *sql.DB) {
	db.connections <- conn
}

func ConnectionPool(nConn int) (*dbConn, error) {
	conns := make(chan *sql.DB, nConn)

	for i := 0; i < nConn; i++ {
		conn, err := sql.Open("sqlite3", "./db/database.db")
		if err != nil {
			return nil, err
		}

		conns <- conn
	}

	return &dbConn{
		connections: conns,
	}, nil
}
