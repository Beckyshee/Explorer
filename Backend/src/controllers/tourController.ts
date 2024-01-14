import { Request, Response } from "express";

class TourController {
  // Dummy data for illustration
  private tours = [
    {
      id: 1,
      name: "Tour 1",
      description: "Lorem ipsum...",
      destination: "Paris",
      duration: 7,
      price: 1000,
      tourType: "Adventure",
    },
    {
      id: 2,
      name: "Tour 2",
      description: "Lorem ipsum...",
      destination: "Rome",
      duration: 5,
      price: 800,
      tourType: "Cultural",
    },
    // Add more tours as needed
  ];

  getAllTours(req: Request, res: Response): void {
    res.json(this.tours);
  }

  getTourById(req: Request, res: Response): void {
    const tourId = parseInt(req.params.id, 10);
    const tour = this.tours.find((t) => t.id === tourId);

    if (tour) {
      res.json(tour);
    } else {
      res.status(404).json({ message: "Tour not found" });
    }
  }

  createTour(req: Request, res: Response): void {
    const newTour = req.body;
    // Add your validation logic here

    // For simplicity, generate a dummy id
    const id = this.tours.length + 1;
    const tourWithId = { id, ...newTour };
    this.tours.push(tourWithId);

    res.status(201).json(tourWithId);
  }

  updateTour(req: Request, res: Response): void {
    const tourId = parseInt(req.params.id, 10);
    const updatedTour = req.body;
    // Add your validation logic here

    const index = this.tours.findIndex((t) => t.id === tourId);

    if (index !== -1) {
      this.tours[index] = { ...this.tours[index], ...updatedTour };
      res.json(this.tours[index]);
    } else {
      res.status(404).json({ message: "Tour not found" });
    }
  }

  deleteTour(req: Request, res: Response): void {
    const tourId = parseInt(req.params.id, 10);
    const index = this.tours.findIndex((t) => t.id === tourId);

    if (index !== -1) {
      const deletedTour = this.tours.splice(index, 1);
      res.json(deletedTour[0]);
    } else {
      res.status(404).json({ message: "Tour not found" });
    }
  }
}

export default new TourController();
