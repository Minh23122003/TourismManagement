import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Text, View } from "react-native"
import {MyDispatchContext} from "../../configs/Contexts"
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Style from "./Style";
import { Button, TextInput } from "react-native-paper";

const Login = () => {
    const [user, setUser] = React.useState({})
    const fields = [{
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "name": "password",
        "secureTextEntry": true
    }]
    const [loading, setLoading] = React.useState(false)
    const nav = useNavigation()
    const dispatch = useContext(MyDispatchContext)

    const updateState = (field, value) => {
        setUser(current => {
            return {...current, [field]:value}
        })
    }

    const login = async () => {
        setLoading(true)
        try {
            let res = await APIs.post(endpoints['login'], {
                "username": "vovantan",
                "password": "123456",
                "client_id": "1Xfl04lXCtLML94KYttBFXkMr830rZDWMadkirSs",
                "client_secret": "oJyFUlcCzbkQQAEj3AgGC6NXEewiUAAA3dPFhNuvxhZdzDUuGoksaZnTNBVWKSn655SAItIU7xp0Jvh2nZ7GqAntBS4mD90Odz5M9jdvvPogzOZibnqXz96wpglxQO6Q",
                "grant_type": "password"
            })
            console.info(res.data)

            await AsyncStorage.setItem("token", res.data.access_token)

            setTimeout(async () => {
                let user = await authApi(res,data.access_token).get(endpoints['current-user'])
                console.info(user.data)

                dispatch({
                    'type': "login",
                    'payload': user.data
                })
                nav.goBack();
            }, 100)
        } catch (ex) {
            console.error(ex)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[Style.container, Style.margin]}>
            <Text style={Style.text}>Dang nhap nguoi dung</Text>
            {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={user[f.name]} onChangeText={t => updateState(f.name, t)} style={Style.margin} key={f.name} label={f.label} right={<TextInput.Icon icon={f.icon} />} />)}
            <Button icon="account" loading={loading} mode="contained" onPress={login}>Dang nhap</Button>
            <Text style={Style.margin}>Ban chua co tai khoan? Nhan dang ky </Text>
            <Button style={Style.margin} mode="contained" onPress={() => nav.navigate('Register')} >Dang ky</Button>
        </View>
    )
}

export default Login;