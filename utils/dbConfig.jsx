import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon('postgresql://Dashboard%20tracker_owner:4fvnmj7erSZR@ep-purple-bar-a5z0fpaj.us-east-2.aws.neon.tech/Dashboardtracker?sslmode=require'); 
export const db = drizzle(sql, { schema });


