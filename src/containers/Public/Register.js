import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import InputForm from "../../components/InputForm";
import * as actions from '../../store/actions';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [invalidFields, setInvalidFields] = useState([]);
    const [payload, setPayload] = useState({
        phone: '',
        password: '',
        name: '',
        email: ''
    });

    const authState = useSelector(state => state.auth);

    useEffect(() => {
        if (authState.isRegister) {
            // Registration success

            Swal.fire({
                icon: 'success',
                title: 'Đăng ký thành công!',
                showConfirmButton: false,
                timer: 1500
            });
            // Reset registration state
            dispatch(actions.resetRegister());

            // Clear input fields
            setPayload({
                phone: '',
                password: '',
                name: '',
                email: ''
            });

            // Reset invalid fields state
            setInvalidFields([]);
        } else if (authState.msg) {
            // Registration failed, display error message
            Swal.fire({
                icon: 'error',
                title: 'Đăng ký thất bại',
                text: authState.msg
            });
            // Reset registration state
            dispatch(actions.resetRegister());
        }
    }, [authState.isRegister, authState.msg, dispatch]);

    const handleSubmit = async () => {
        let invalids = validate(payload);
        if (invalids === 0)
            dispatch(actions.register(payload));
    };

    const validate = (payload) => {
        let invalids = 0
        let fields = Object.entries(payload)
        fields.forEach(item => {
            if (item[1] === '') {
                setInvalidFields(prev => [...prev, {
                    name: item[0],
                    message: 'Bạn không được để trống trường này.'
                }])
                invalids++
            }
        })
        fields.forEach(item => {
            switch (item[0]) {
                case 'password':
                    if (item[1].length < 6) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Mật khẩu phải có tối thiểu 6 ký tự.'
                        }])
                        invalids++
                    }
                    break;
                case 'phone':
                    if (!+item[1]) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Số điện thoại không hợp lệ.'
                        }])
                        invalids++
                    }
                    break

                case 'email':
                    // Kiểm tra định dạng email sử dụng regular expression
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(item[1])) {
                        setInvalidFields(prev => [...prev, {
                            name: item[0],
                            message: 'Email không hợp lệ.'
                        }])
                        invalids++
                    }
                    break;

                default:
                    break;
            }
        })
        return invalids
    }
    return (
        <div className="w-full items-center justify-center flex mt-5">
            <div className='bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm '>
                <h3 className="font-semibold text-[#0E2E50] text-4xl mb-3">Đăng Ký</h3>
                <div className="w-full flex flex-col gap-3">
                    <InputForm
                        setInvalidFields={setInvalidFields}
                        invalidFields={invalidFields}
                        lable={'Họ Tên'}
                        value={payload.name}
                        setValue={setPayload}
                        keyPayload={'name'} />
                    <InputForm
                        setInvalidFields={setInvalidFields}
                        invalidFields={invalidFields}
                        lable={'Số Điện Thoại'}
                        value={payload.phone}
                        setValue={setPayload}
                        keyPayload={'phone'} />
                    <InputForm
                        setInvalidFields={setInvalidFields}
                        invalidFields={invalidFields}
                        lable={'Email'}
                        value={payload.email}
                        setValue={setPayload}
                        keyPayload={'email'} />
                    <InputForm
                        setInvalidFields={setInvalidFields}
                        invalidFields={invalidFields}
                        lable={'Mật khẩu'}
                        value={payload.password}
                        setValue={setPayload}
                        keyPayload={'password'}
                        type='password'
                    />

                    <div className="mt-4">
                        <Button bgColor='bg-[#00B98E]' textColor='text-white' fullWidth text='Đăng Ký'
                            onClick={handleSubmit}
                        />
                    </div>
                    <div className='mt-4 flex items-center justify-between'>
                        <div> Bạn đã có tài khoản?
                            <Link to="/login" className="text-[#00B98E] hover:text-[#FF6600]">
                                Đăng nhập ngay
                            </Link>
                        </div>

                    </div>

                </div>
            </div>

        </div>



    );
}
export default Register;