import React, { useContext } from "react"
import { ActivityIndicator, Alert, ScrollView, Text, RefreshControl, View, TouchableOpacity } from "react-native"
import { Button } from "react-native-paper"
import APIs, { authApi, endpoints } from "../../configs/APIs"
import Style from "./Style"
import { MyUserContext } from "../../configs/Contexts"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

const Cart = ({navigation}) => {
    const user = useContext(MyUserContext)
    const [booking, setBooking] = React.useState(null)
    const [total, setTotal] = React.useState(0)
    const [quantityBooking, setQuantityBooking] = React.useState(0)
    const [content, setContent] = React.useState("")

    const loadBooking = async () => {
        try {
            let token = await AsyncStorage.getItem('access-token')
            let res = await authApi(token).get(endpoints['booking'])
            console.info(res.data)
            if (res.status===204){
                setBooking(null)
                setContent(res.data.content)
            }
            else {
                setBooking(res.data.results)
                setTotal(res.data.total)
                setContent(null)
            }
            setQuantityBooking(res.data.results.length)
        } catch (ex) {
            console.error(ex)
        }
    }

    React.useEffect(() => {
        loadBooking()
    })

    const deleteBooking =async (id) => {     
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = authApi(token).delete(endpoints['deleteBooking'](id))   
                setQuantityBooking(quantityBooking-1)
                navigation.navigate('Cart')               
            } catch (ex) {
                console.error(ex)
            }
    }

    const pay = async () => {
        try {
            console.info(user)
            console.info(total)
            console.info(quantityBooking)
            let res =await APIs.post(endpoints["pay"], {
                "user_id": user.id,
                "total": total
            })
            setQuantityBooking(0)
            navigation.navigate('Cart')
        } catch (ex) {
            console.error(ex)
        }
    }

    const confirmDelete = async (id) => {
        await Alert.alert('Xac nhan', 'Ban chac chan muon xoa?', [{text:'Co', onPress: () => {deleteBooking(id)}, style:"delete"}, {text:'Khong'}])
    }
    
    const confirmPay = async () => {
        await Alert.alert('Xac nhan', 'Ban xac nhan thanh toan??', [{text:'Co', onPress: () => {pay()}}, {text:'Khong'}])
    }

    return (
        <ScrollView style={[Style.container, {}]}>
            <RefreshControl onRefresh={() => loadBooking()} />
                {content!==null?<Text>Ban chua dat tour nao</Text>:<>
                    {booking.map(b => <View key={b.id} style={[Style.container, Style.margin, Style.booking, Style.row, {width:400}]}>
                        <View style={[Style.margin, {flex:1}]}>
                            <Text>{b.tour_name}</Text>
                            <Text>So luong ve nguoi lon: {b.quantity_ticket_adult}</Text>
                            <Text>So luong ve tre em: {b.quantity_ticket_children}</Text>
                        </View>
                        <View style={[Style.margin, {flex:1}]}>
                            <Text>Tong tien: {b.total}</Text>
                            <TouchableOpacity style={[Style.button, {width:70, marginTop:10, padding:5}]} key={b.id} onPress={() => confirmDelete(b.id)} ><Text>Huy ve</Text></TouchableOpacity>
                        </View>
                    </View>)}
                    <Text>Tong tien: {total}</Text>
                    <TouchableOpacity onPress={() => confirmPay()} style={[Style.pay]}><Text>Thanh toan</Text></TouchableOpacity>
                </>}
        </ScrollView>
    )
}

export default Cart