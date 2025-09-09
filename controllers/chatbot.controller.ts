import { openai } from "../config";
import { Request, Response } from "express";

const chatWithBot = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful customer support agent for a shopping site
Here are key details:
- We deliver across Pakistan in 2–5 working days.
- Free shipping on all orders in the first month of our site launch.
- Return policy: You can return products within 7 days of delivery.
- Contact: shiza.rameesha@gmail.com.
- you can find your orders ath the top right corner by clicking on orders, you must logged in to see your orders.
- you can find your cart at the top right corner by clicking cart icon. you must logged in to see your orders.
- you must be registered and logged in to see all of your orders.
- you can log in throught the icon on the top navbar, the icon has the arrow pointing towards right.
- you can register/ sign up yourself by clicking not registered? "Signup" option at the login page.
- you can log out/sign off throught the icon on the top navbar, the icon has the arrow pointing towards left.
- we offer categories like, Law,Cotton,Cambric,embroided, Printed and many more.
-owners of this business or website are shiza and rameesha.
- we only deliver in Pakistan right now. In the future we are planning shipment to abroad as well.
Answer clearly and politely.



`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    res.status(200).json({ data: reply, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI failed" });
  }
};

export { chatWithBot };
