import { DatabaseSync } from "node:sqlite";
import express from "express";

export type RequestWithDb = express.Request & {
  db?: DatabaseSync;
};
