import ConnectToDB from "@/app/lib/mongodb";
import Usermodel from "@/model/Usermodel";
import { getAuthFromCookies } from "@/components/utils/authServer";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await ConnectToDB();

      
        const userAuth = await getAuthFromCookies();
        if (!userAuth.isLoggedIn) {
            return NextResponse.json({ message: "لطفا ابتدا وارد حساب خود شوید" }, { status: 401 });
        }

        const body = await req.json();
        const { city, address, plaque, unit, postalCode, receiverName, receiverPhone } = body;

        
        if (!city || !address || !plaque || !postalCode || !receiverName || !receiverPhone) {
            return NextResponse.json({ message: "لطفا تمام فیلد‌های اجباری را پر کنید" }, { status: 400 });
        }
            const currentUser = await Usermodel.findById(userAuth.user.userId);
        if (!currentUser) {
            return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
        }
       const isFirstAddress = currentUser.addresses.length === 0;
        const toEnglishDigits = (str) => {
    return str.replace(/[۰-۹]/g, (d) => 
        '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()
    );
};


const normalizedPostal = toEnglishDigits(postalCode);
const normalizedPhone = toEnglishDigits(receiverPhone);
        const updatedUser = await Usermodel.findByIdAndUpdate(
            userAuth.user.userId,
            {
                $push: {
                    addresses: {
                        city,
                        address,
                        plaque,
                        unit,
                        postalCode:normalizedPostal,
                        receiverName,
                        receiverPhone:normalizedPhone,
                        isDefault: isFirstAddress  
                    }
                }
            },
            { new: true } 
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "آدرس با موفقیت ثبت شد", addresses: updatedUser.addresses },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json(
            { message: "خطای سرور در ثبت آدرس" },
            { status: 500 }
        );
    }
}
