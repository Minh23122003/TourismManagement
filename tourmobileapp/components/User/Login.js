import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native"
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
        "field": "username"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "field": "password",
        "secureTextEntry": true
    }]
    const [loading, setLoading] = React.useState(false)
    const nav = useNavigation()
    const dispatch = useContext(MyDispatchContext)

    const change = (field, value) => {
        setUser(current => {
            return {...current, [field]:value}
        })
    }

    const login = async () => {
        setLoading(true)
        try {
            let res = await APIs.post(endpoints['login'], {
                ...user,
                "client_id": "O0EBKl6Bj2mVuYcSiLmznoaYCGU0uNJPSwvdQpZW",
                "client_secret": "Ky8W3yuWDMjYfnYYNLzjo1NJ3RJBVq8wFLqDwX8p0LK1X0xCbAqWWAZEih3hEMLU1ovl5CDRZn0MVcVygjhmh9XS1XwazEpIxPMx0GUnTENpmgYE72pVhLBipijcZP2f",
                "grant_type": "password"
            })
            console.info(res.data)

            AsyncStorage.setItem("access-token", res.data.access_token)

            setTimeout(async () => {
                let user = await authApi(res.data.access_token).get(endpoints['current-user'])
                console.info(user.data)

                dispatch({
                    'type': "login",
                    'payload': user.data
                })
                nav.navigate('Tour')
            }, 100)
        } catch (ex) {
            console.error(ex)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[Style.container, Style.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <Text style={Style.text}>Dang nhap nguoi dung</Text>
                {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={user[f.field]} onChangeText={t => change(f.field, t)} style={Style.margin} key={f.field} label={f.label} right={<TextInput.Icon icon={f.icon} />} />)}
                <Button icon="account" loading={loading} mode="contained" onPress={login}>Dang nhap</Button>
                <Text style={Style.margin}>Ban chua co tai khoan? Nhan dang ky </Text>
                <Button style={Style.margin} mode="contained" onPress={() => nav.navigate('Register')} >Dang ky</Button>
            </KeyboardAvoidingView>
        </View>
    )
}

export default Login;