import { Link, useParams } from "react-router-dom";
// import AccountNav from "../AccountNav";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import projectImg from "../projectImg";
export default function projectsPage() {
    //   const [projects,setprojects] = useState([]);
    //   useEffect(() => {
    //     axios.get('/user-projects').then(({data}) => {
    //       setprojects(data);
    //     });
    //   }, []);
    const projects = [
        {
            _id: '1',
            name: 'Project 1',
            description: 'Description for Project 1',
            start_date: new Date(),
            end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 ngày sau
            status: 'Start',
        },
        {
            _id: '2',
            name: 'Project 2',
            description: 'Description for Project 2',
            start_date: new Date(),
            end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: 'Start',
        },
        {
            _id: '3',
            name: 'Project 3',
            description: 'Description for Project 3',
            start_date: new Date(),
            end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: 'Start',
        },
        {
            _id: '4',
            name: 'Project 4',
            description: 'Description for Project 4',
            start_date: new Date(),
            end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: 'End',
        },
        {
            _id: '5',
            name: 'Project 5',
            description: 'Description for Project 5',
            start_date: new Date(),
            end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: 'Finish',
        }
    ]
    return (
        <div>
            this is project page
            {/* <AccountNav /> */}
            <div className="mt-4">
                {projects.length > 0 && projects.map(project => (
                    <Link to={'/account/projects/' + project._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{project.name}</h2>
                            <p className="text-sm mt-2">{project.description}</p>
                        </div>
                    </Link>
                ))}
                <div className="text-center">
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/projects/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                        Add new project
                    </Link>
                </div>
            </div>
        </div>
    );
}