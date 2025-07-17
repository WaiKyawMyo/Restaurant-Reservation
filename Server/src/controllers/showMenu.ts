import { Request, Response } from "express";
import { asyncHandler } from "../Utils/asyncHandler";
import { Menu } from "../models/Menu";
import { Set } from "../models/Set";
import { SetMenu } from "../models/SetMenu";

export const getAllMenu = asyncHandler(async (req: Request, res: Response) => {
  const menu = await Menu.find();
  const sets = await Set.aggregate([
    {
      $lookup: {
        from: "set_menus",
        let: { setId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$set_id", "$$setId"] } } },
          {
            $lookup: {
              from: "menus",
              localField: "menu_id",
              foreignField: "_id",
              as: "menu",
            },
          },
          {
            $unwind: "$menu",
          },
          {
            $project: {
              _id: 0,
              unit_Quantity: 1,
              menu: 1,
            },
          },
        ],
        as: "sets",
      },
    },
  ]);

  if (menu.length === 0 && sets.length === 0) {
     res.status(404).json({ message: "No menu or sets found" });
  }

  res.status(200).json({ menu: menu, sets: sets });
});