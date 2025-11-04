module.exports =(app)=>{
    const BaseService = require('./base')(app);
    return class ProjectService extends BaseService{
        async getList(){
            // console.log(111,this.curl);
            
            return [{
                name:'project1',
                desc:'project1 desc'
            },{
                name:'project2',
                desc:'project2 desc'
            },{
                name:'project3',
                desc:'project3 desc'
            },
        ]
        }
    }
}