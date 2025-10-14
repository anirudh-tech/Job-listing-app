interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  createdAt: string;
  timeGap: number;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
        <span className="text-sm text-gray-500">{formatDate(job.createdAt)}</span>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-2">
          <span className="font-medium">Company:</span> {job.company}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Valid for:</span> {job.timeGap} days
        </p>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Posted {formatDate(job.createdAt)}
        </span>
      </div>
    </div>
  );
}
