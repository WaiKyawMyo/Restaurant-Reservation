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
        localField: "_id",
        foreignField: "set_id",
        as: "menus",
      },
    },
  ]);

  if (!menu && !sets ) {
     res.status(404).json({ message: "No menu or sets found" });
  }

   res.status(200).json({ menu: menu, sets: sets});
});