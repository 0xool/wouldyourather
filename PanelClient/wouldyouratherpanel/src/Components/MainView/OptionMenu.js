import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class OptionMenu extends Component {
    render () {
        return (
            <div className='Main-view-login-container'>
                
                <Link to={{pathname:'/addQuestion'}} className='Main-view-login-add-question'>
                    اضافه کردن سوال
                </Link>
                <Link to={{pathname:'/validateQuestion'}} className='Main-view-login-check-question'>
                    چک کردن سوال
                </Link>
                <Link to={{pathname:'/questionList'}} className='Main-view-login-question-list'>
                    لیست سوال ها
                </Link>
                <Link to={{pathname:'/userList'}} className='Main-view-login-user-list'>
                    لیست کاربران
                </Link>
                <Link to={{pathname:'/gameControlPanel'}} className='Main-view-control-user-list'>
                    تنظیمات بازی
                </Link>
            </div>
        )
    }
}

export default OptionMenu