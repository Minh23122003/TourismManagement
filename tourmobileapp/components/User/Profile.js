import { useContext } from "react";
import { Alert, Image, Text, View } from "react-native"
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import Style from "./Style";
import { Button } from "react-native-paper";

const Profile = () => {
    const user = useContext(MyUserContext)
    const dispatch = useContext(MyDispatchContext)

    const confirmLogout = async () => {
        await Alert.alert('Xac nhan', 'Ban chac chan muon thoat?', [{text:'Co', onPress: () => {dispatch({"type": "logout"})}, style:"delete"}, {text:'Khong'}])
    }

    return(
        <View style={[Style.container, Style.margin]}>
            <Text style={Style.text} >Thong tin nguoi dung</Text>
            <Text style={Style.text} >Chao {user.first_name} {user.last_name}</Text>
            <Image source={{uri:user.avatar}} style={Style.avatar} />
            <Button icon="logout" onPress={() => confirmLogout()}>ĐĂNG XUẤT</Button>
        </View>
    )
}

export default Profile;