import React, { useContext } from "react"
import { ActivityIndicator, Alert, ScrollView, Text, RefreshControl, View, TouchableOpacity } from "react-native"
import { Button } from "react-native-paper"
import { authApi, endpoints } from "../../configs/APIs"
import Style from "./Style"
import { MyUserContext } from "../../configs/Contexts"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Cart = ({navigation}) => {
    const user = useContext(MyUserContext)
    const [booking, setBooking] = React.useState(null)

    const loadBooking = async () => {
        try {
            let token = await AsyncStorage.getItem('access-token')
            let res = await authApi(token).get(endpoints['booking'])
            setBooking(res.data)
        } catch (ex) {
            console.error(ex)
        }
    }

    React.useEffect(() => {
        loadBooking();
    }, [])

    const deleteBooking = (id) => {     
            try {
                // let token = await AsyncStorage.getItem('access-token')
                let token = "Q0Naml9a20bF5XON7rFjvpdm08mkDj"
                let res = authApi(token).delete(endpoints['deleteBooking'](id))   
                navigation.navigate('Cart')         
                alert.co
            } catch (ex) {
                console.error(ex)
            }
    }

    const confirm = async (id) => {
        await Alert.alert('Xac nhan', 'Ban chac chan muon xoa?', [{text:'Co', onPress: () => {deleteBooking(id)}, style:"delete"}, {text:'Khong'}])
    } 

    return (
        <ScrollView style={[Style.container, {}]}>
            <RefreshControl onRefresh={() => loadBooking()} />
            {user===null?<Text>Ban chua dang nhap. Vui long dang nhap de xem!</Text>:<>
                {booking===null?<Text>Ban chua dat tour nao</Text>:<>
                    {booking.map(b => <View key={b.id} style={[Style.container, Style.margin, Style.booking, Style.row, {width:400}]}>
                        <View style={[Style.margin, {flex:1}]}>
                            <Text>{b.tour_name}</Text>
                            <Text>So luong ve nguoi lon: {b.quantity_ticket_adult}</Text>
                            <Text>So luong ve tre em: {b.quantity_ticket_children}</Text>
                        </View>
                        <View style={[Style.margin, {flex:1}]}>
                            <Text>Tong tien: {b.total}</Text>
                            <TouchableOpacity style={[Style.button, {width:70, marginTop:10, padding:5}]} key={b.id} onPress={() => confirm(b.id)} ><Text>Huy ve</Text></TouchableOpacity>
                        </View>
                    </View>)}
                    <TouchableOpacity style={[Style.pay]}><Text>Thanh toan</Text></TouchableOpacity>
                </>}
            </>}
        </ScrollView>
    )
}

export default Cart