const mongoose = require("mongoose")

const clientConfigSchema = mongoose.Schema({


    buyUsComponentLimit:{
        type:Number,
        default:2,
    },
    rateUsComponentLimit:{
        type:Number,
        default:20,
    },
    buyUsPopUpTimer:{
        type:Number,
        default:60000,
    },
    buyUsPopUpText: {
        type:String,
        default:'!اگه می‌خوای دیگه تبلیغ نبینی و از یه تیم جوون حمایت کنی، بسته‌ی حذف تبلیغات رو تهیه کن',
    },
    rateUsFirstText : {
        type:String,
        default:'می‌خوام به کدومش امتیاز بدم'
    },  
    rateUsSecondText : {
        type:String,
        default:'نمی‌خوام به کدومش امتیاز بدم'
    },
    buyUsFirstText : {
        type:String,
        default:'!خسته شدم از تبلیغات'
    },
    buyUsSecondText : {
        type:String,
        default:'نه بابا خوبه. مشکلی باهاش ندارم',
    },
    created: {
        type: Date,
        default:Date.now,
    },
    addQuestionRuleText: {
        type:String,
        default: `
        ما تو «کدومش؟» سوال‌ها رو بر اساس ۴ قانون زیر طرح می‌کنیم و ویرایش سوال‌ها هم بر اساس همین اصول انجام می‌شه:
        
        ۱- رعایت قوانین و هنجارهای کشور. عدم توهین به مقدسات، عدم طرح هرگونه سوال سیاسی، غیراخلاقی و ضد هنجارهای عمومی.
        
        ۲- رعایت قواعد نگارشی فارسی و انگلیسی برای طرح سوالات و رعایت اصل ساده و تمیزنویسی.
        
        ۳- تطابق سوالات با قوانین و قالب بازی «کدومش؟» و حفظ جذابیت‌های رقابتی و دورهمی بازی.
        
        ۴- خلاقیت! تو «کدومش؟» خلاقیت برای طرح سوالات حرف اول و آخر رو می‌زنه و قطعا به مرور زمان، این فاکتور از هر چیزی مهم‌تر خواهد بود.
        `
    },
    shareUsShakeAnimationStart: {
        type:Number,
        default:14000,
    },
    shareUsTutorialAnimationStart: {
        type:Number,
        default:60000,
    },
    showPopUpAdLimit: {
        type:Number,
        default: 3
    }
},{timestamp:true})

const ClientConfig = mongoose.model('clientConfig' , clientConfigSchema)

module.exports = {ClientConfig}