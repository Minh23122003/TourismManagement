import React, { useContext } from "react";
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import Style from "./Style";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const user = useContext(MyUserContext)
    const dispatch = useContext(MyDispatchContext)
    const nav = useNavigation()

    const confirmLogout = async () => {
        await Alert.alert('Xác nhận', 'Bạn chắc chắn muốn thoát?', [{text:'Có', onPress: () => {dispatch({"type": "logout"})}, style:"delete"}, {text:'Không'}])
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    return(
        <View style={[Style.container, Style.margin]}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                <Text style={Style.text} >Thông tin người dùng</Text>
                <Text style={Style.text} >Chào {user.first_name} {user.last_name}</Text>
                <Text style={Style.text} >Email: {user.email}</Text>
                <Text style={Style.text} >Địa chỉ: {user.info.address}</Text>
                <Text style={Style.text} >Số điện thoại: {user.info.phone}</Text>
                <Image source={{uri:user.avatar}} style={Style.avatar} />
                <Button onPress={()=> nav.navigate('ChangUser') } >Sửa thông tin tài khoản</Button>
                <Button icon="logout" onPress={() => confirmLogout()}>ĐĂNG XUẤT</Button>
            </ScrollView>
        </View>
    )
}

export default Profile;