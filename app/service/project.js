module.exports =(app)=>{
    return class ProjectService{
        async getList(){
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