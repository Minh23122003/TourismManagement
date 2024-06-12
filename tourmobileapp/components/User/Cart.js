import React, { useContext } from "react"
import { ActivityIndicator, Alert, ScrollView, Text, RefreshControl, View, TouchableOpacity } from "react-native"
import { Button } from "react-native-paper"
import APIs, { authApi, endpoints } from "../../configs/APIs"
import Style from "./Style"
import { CartContext, CartDispatchContext, MyUserContext } from "../../configs/Contexts"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

const Cart = ({navigation}) => {
    const user = useContext(MyUserContext)
    const [booking, setBooking] = React.useState(null)
    const [total, setTotal] = React.useState(0)
    const [quantityBooking, setQuantityBooking] = React.useState(0)
    const cartDispatch = useContext(CartDispatchContext)
    const cart = useContext(CartContext)

    const loadBooking = async () => {
        try {
            let token = await AsyncStorage.getItem('access-token')
            let res = await authApi(token).get(endpoints['booking'])
            console.info(res.data)    
            setBooking(res.data.results)
            setTotal(res.data.total)
            setQuantityBooking(res.data.results.length)
            cartDispatch({
                'type': "cart",
                'payload': res.data.results.length
            })
            console.info(cart)
        } catch (ex) {
            console.error(ex)
        }
    }

    React.useEffect(() => {
        loadBooking()
    }, [quantityBooking, cart])

    const deleteBooking =async (id) => {     
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = authApi(token).delete(endpoints['deleteBooking'](id))   
                cartDispatch({
                    'type': "delete"
                })  
                console.info(cart)         
            } catch (ex) {
                console.error(ex)
            }
    }

    const pay = async () => {
        try {
            let res =await APIs.post(endpoints["pay"], {
                "user_id": user.id,
                "total": total
            })
            cartDispatch({
                'type': "pay",
            })
            console.info(cart)
        } catch (ex) {
            console.error(ex)
        }
    }

    const confirmDelete = async (id) => {
        await Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xóa?', [{text:'Có', onPress: () => {deleteBooking(id)}, style:"delete"}, {text:'Không'}])
    }
    
    const confirmPay = async () => {
        await Alert.alert('Xác nhận', 'Ban xác nhận thanh toán??', [{text:'Có', onPress: () => {pay()}}, {text:'Không'}])
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            loadBooking()
            setRefreshing(false);
        }, 1000);
    }, []);

    return (
        <ScrollView style={[Style.container, {}]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
            {booking===null||booking.length===0?<Text style={Style.margin} >Bạn chưa đặt tour nào</Text>:<>
                {booking.map(b => <View key={b.id} style={[Style.container, Style.margin, Style.booking, Style.row, {width:400}]}>
                    <View style={[Style.margin, {flex:1}]}>
                        <Text>{b.tour_name}</Text>
                        <Text>Số lượng vé người lớn: {b.quantity_ticket_adult}</Text>
                        <Text>Số lượng vé trẻ em: {b.quantity_ticket_children}</Text>
                    </View>
                    <View style={[Style.margin, {flex:1}]}>
                        <Text>Tổng tiền: {b.total}</Text>
                        <TouchableOpacity style={[Style.button, {width:70, marginTop:10, padding:5}]} key={b.id} onPress={() => confirmDelete(b.id)} ><Text>Hủy vé</Text></TouchableOpacity>
                    </View>
                </View>)}
                <Text>Tổng cộng: {total}</Text>
                <TouchableOpacity onPress={() => confirmPay()} style={[Style.pay]}><Text>Thanh toán</Text></TouchableOpacity>
            </>}
        </ScrollView>
    )
}

export default Cart