import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import mssql from "mssql";
import { sqlConfig } from "../configs/sqlConfig";

class TourController {
  // Dummy data for illustration
  private tours = [
    // Existing dummy tour data...
  ];

  async getAllTours(req: Request, res: Response): Promise<void> {
    try {
      const pool = await mssql.connect(sqlConfig);

      const tours = await pool.request().execute("getAllTours");

      res.status(200).json({
        tours: tours.recordset,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async getTourById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const pool = await mssql.connect(sqlConfig);

      const tour = await pool
        .request()
        .input("tourId", mssql.VarChar, id)
        .execute("getTourById");

      if (tour.recordset.length === 1) {
        res.status(200).json({
          tour: tour.recordset[0],
        });
      } else {
        res.status(404).json({
          message: "Tour not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async createTour(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, destination, duration, price, tourType } =
        req.body;
      const tourId = uuidv4();

      const pool = await mssql.connect(sqlConfig);

      await pool
        .request()
        .input("tourId", mssql.VarChar, tourId)
        .input("name", mssql.VarChar, name)
        .input("description", mssql.VarChar, description)
        .input("destination", mssql.VarChar, destination)
        .input("duration", mssql.Int, duration)
        .input("price", mssql.Float, price)
        .input("tourType", mssql.VarChar, tourType)
        .execute("createTour");

      res.status(201).json({
        message: "Tour created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

 
}

export default new TourController();
