import handleAPI from "@/apis/handleAPI"
import { Button } from "antd"
import axios from "axios"


const FakeProducts = () => {
    const fakeData = async () => {
        const api = "https://fakestoreapi.com/products"

        const res = await axios(api)
        if (res.status === 200) {
            const data = res.data

            data.forEach((item: any) => handleAdd(item));
        }
    }

    const handleAdd = async (item: any) => {
        const data = {
            categoryId: "6768ec4e6a063e190c818741",
            discountPercentage: 1.4,
            price: item.price,
            status: "active",
            title: item.title,
            versions: [{
                color: "#ffff",
                quantity: 50
            }],
            description: item.description,
            images: [item.image]
        }
        await handleAPI("products", data, "post");
    }

    return (
        <Button onClick={fakeData}>Fake data</Button>
    )
}

export default FakeProducts