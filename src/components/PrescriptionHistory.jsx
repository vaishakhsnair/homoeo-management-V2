import axios from "axios";

export default function PrescriptionHistory({PrescriptionHistory}) {
    

    const tableHeaders = ["Serial","Size","Medium","Meds","Dosage","cost","Count","Duplicate"];

    const tableFrame = 
        <table className="table table-auto table-striped table-bordered border-separate border-spacing-1  w-4/5 self-center m-2 ">
            <thead>
                <tr>
                    {tableHeaders.map((header,index) => {
                            return <th key={index} className="border border-transparent  w-1/9">{header}</th>
                        }
                    )}
                </tr>
            </thead>
            <tbody>
                
            </tbody>

        </table>

    

    return (
        <div className='w-11/12'>
            {tableFrame}
        </div>
    )
}

