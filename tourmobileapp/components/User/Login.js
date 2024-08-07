import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native"
import {MyDispatchContext} from "../../configs/Contexts"
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Style from "./Style";
import { Button, HelperText, TextInput } from "react-native-paper";
import SelectDropdown, {} from "react-native-select-dropdown";

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
    const [err, setErr] = React.useState(false)

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
                "client_id": "HqqfQ79msapPSD8i2WQMjHAi3KGxFbU1PDLapkav",
                "client_secret": "cF5bGbEzAMwIHiESXn2lJMiGGVIRWHBVcCv6tk9NYoQSyAT7IOGIpMKfsceXkfkzyovYcZEOhYXmCSq1sN2vRQdMiopIE3Ds3AmKxDodkxGT2LW2jizJja5534yW4n8S",
                "grant_type": "password"
            })
            console.info(res.data)

            if(res.status===200){
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
            } else setErr(true)
        } catch (ex) {
            // console.error(ex)
        } finally {
            setLoading(false)
            setErr(true)
        }
    }

    return (
        <View style={[Style.container, Style.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                <Text style={Style.text}>Đăng nhập</Text>
                {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={user[f.field]} onChangeText={t => change(f.field, t)} style={Style.margin} key={f.field} label={f.label} />)}
                <HelperText style={[Style.margin, {color:"red"}]} visible={err} >Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại</HelperText>
                <Button style={Style.margin} icon="account" loading={loading} mode="contained" onPress={login}>ĐĂNG NHẬP</Button>
                <Text style={Style.margin}>Bạn chưa có tài khoản? Nhấn đăng ký </Text>
                <Button style={Style.margin} mode="contained" onPress={() => nav.navigate('Register')} >ĐĂNG KÝ</Button>
            </KeyboardAvoidingView>
        </View>
    )
}

export default Login;