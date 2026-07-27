
import { NextResponse } from "next/server";
import ConnectToDB from "@/app/lib/mongodb";
import Order from "@/model/Ordermodel";

export async function POST(req) {
  try {
    await ConnectToDB();

    const { orderId, gateway } = await req.json();

    if (!orderId || !gateway) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات ناقص است.",
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "سفارش پیدا نشد.",
        },
        { status: 404 }
      );
    }

    if (order.isPaid) {
      return NextResponse.json(
        {
          success: false,
          message: "این سفارش قبلاً پرداخت شده است.",
        },
        { status: 400 }
      );
    }

    order.paymentGateway = gateway;

    let paymentUrl = "zxc";
    let authority = "";

    switch (gateway) {
      case "ZARINPAL":
        // TODO: درخواست Payment Request به زرین‌پال
        // authority = ...
        // paymentUrl = ...
        break;

      case "ZIBAL":
        // TODO: درخواست به زیبال
        break;

      case "NEXTPAY":
        // TODO: درخواست به نکست‌پی
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "درگاه نامعتبر است.",
          },
          { status: 400 }
        );
    }

    order.paymentAuthority = authority;

    await order.save();

    return NextResponse.json({
      success: true,
      paymentUrl,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "خطای سرور.",
      },
      {
        status: 500,
      }
    );
  }
}