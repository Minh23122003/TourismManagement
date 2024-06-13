import { useContext } from "react";
import { Alert, Image, Text, View } from "react-native"
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import Style from "./Style";
import { Button } from "react-native-paper";

const Profile = () => {
    const user = useContext(MyUserContext)
    const dispatch = useContext(MyDispatchContext)

    const confirmLogout = async () => {
        await Alert.alert('Xác nhận', 'Bạn chắc chắn muốn thoát?', [{text:'Có', onPress: () => {dispatch({"type": "logout"})}, style:"delete"}, {text:'Không'}])
    }

    return(
        <View style={[Style.container, Style.margin]}>
            <Text style={Style.text} >Thông tin người dùng</Text>
            <Text style={Style.text} >Chào {user.first_name} {user.last_name}</Text>
            <Text style={Style.text} >Email: {user.email}</Text>
            <Text style={Style.text} >Địa chỉ: {user.info.address}</Text>
            <Text style={Style.text} >Số điện thoại: {user.info.phone}</Text>
            <Image source={{uri:user.avatar}} style={Style.avatar} />
            <Button icon="logout" onPress={() => confirmLogout()}>ĐĂNG XUẤT</Button>
        </View>
    )
}

export default Profile;