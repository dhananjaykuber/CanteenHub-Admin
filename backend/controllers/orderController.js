import Razorpay from 'razorpay';

export const createOrder = async (req, res) => {
  const { amount } = req.body;

  console.log(amount);

  try {
    const razorpay = new Razorpay({
      key_id: process.env.APIKEY,
      key_secret: process.env.SECRETKEY,
    });

    const order = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Cannot create order.' });
  }
};

export const wakeUp = async (req, res) => {
  res.status(200).json({ message: 'Wake up call working' });
};
