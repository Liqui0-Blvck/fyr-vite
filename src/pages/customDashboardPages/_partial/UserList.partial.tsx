import React, { useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../components/ui/Card';
import { appPages } from '../../../config/pages.config';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/icon/Icon';
import Tooltip from '../../../components/ui/Tooltip';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../templates/common/TableParts.template';
import Input from '../../../components/form/Input';
import FieldWrap from '../../../components/form/FieldWrap';
import { User } from 'src/store/slices/auth/userSlice';


const columnHelper = createColumnHelper<User>();

// const editLinkPath = `../${appPages.crmAppPages.subPages.customerPage.subPages.editPageLink.to}/`;

const users: User[] = [
  {
    uid: "1",
    email: "john.doe@example.com",
    displayName: "John Doe",
    photoURL: "https://example.com/photo1.jpg",
    phoneNumber: "+1234567890",
    first_name: "John",
    second_name: "Michael",
    last_name: "Doe",
    second_last_name: "Smith",
    birth: "1985-02-15",
    gender: "Male",
    role: "Admin",
    createdAt: "2024-01-10T10:00:00.000Z",
    notificationToken: "xyz123abc",
    address: "123 Main St, Springfield, IL",
    position: "CEO",
  },
  {
    uid: "2",
    email: "jane.smith@example.com",
    displayName: "Jane Smith",
    photoURL: "https://example.com/photo2.jpg",
    phoneNumber: "+1234567891",
    first_name: "Jane",
    second_name: "Olivia",
    last_name: "Smith",
    second_last_name: "Johnson",
    birth: "1990-06-20",
    gender: "Female",
    role: "Manager",
    createdAt: "2024-02-12T09:00:00.000Z",
    notificationToken: "abc123xyz",
    address: "456 Oak St, Chicago, IL",
    position: "Marketing Manager",
  },
  {
    uid: "3",
    email: "michael.brown@example.com",
    displayName: "Michael Brown",
    photoURL: "https://example.com/photo3.jpg",
    phoneNumber: "+1234567892",
    first_name: "Michael",
    second_name: "James",
    last_name: "Brown",
    second_last_name: "Williams",
    birth: "1987-08-12",
    gender: "Male",
    role: "Employee",
    createdAt: "2024-03-05T14:00:00.000Z",
    notificationToken: "jkl123mno",
    address: "789 Pine St, Los Angeles, CA",
    position: "Software Developer",
  },
  {
    uid: "4",
    email: "emily.wilson@example.com",
    displayName: "Emily Wilson",
    photoURL: "https://example.com/photo4.jpg",
    phoneNumber: "+1234567893",
    first_name: "Emily",
    second_name: "Rose",
    last_name: "Wilson",
    second_last_name: "Taylor",
    birth: "1995-03-28",
    gender: "Female",
    role: "Admin",
    createdAt: "2024-03-20T08:00:00.000Z",
    notificationToken: "def456ghi",
    address: "101 Maple St, New York, NY",
    position: "HR Specialist",
  },
  {
    uid: "5",
    email: "chris.jones@example.com",
    displayName: "Chris Jones",
    photoURL: "https://example.com/photo5.jpg",
    phoneNumber: "+1234567894",
    first_name: "Chris",
    second_name: "David",
    last_name: "Jones",
    second_last_name: "Davis",
    birth: "1988-10-03",
    gender: "Male",
    role: "Manager",
    createdAt: "2024-04-01T15:30:00.000Z",
    notificationToken: "uvw123pqr",
    address: "202 Birch St, San Francisco, CA",
    position: "Project Manager",
  },
  {
    uid: "6",
    email: "lisa.martinez@example.com",
    displayName: "Lisa Martinez",
    photoURL: "https://example.com/photo6.jpg",
    phoneNumber: "+1234567895",
    first_name: "Lisa",
    second_name: "Marie",
    last_name: "Martinez",
    second_last_name: "Garcia",
    birth: "1992-11-16",
    gender: "Female",
    role: "Employee",
    createdAt: "2024-04-15T16:45:00.000Z",
    notificationToken: "rst456stu",
    address: "303 Cedar St, Houston, TX",
    position: "Graphic Designer",
  },
  {
    uid: "7",
    email: "alex.miller@example.com",
    displayName: "Alex Miller",
    photoURL: "https://example.com/photo7.jpg",
    phoneNumber: "+1234567896",
    first_name: "Alex",
    second_name: "George",
    last_name: "Miller",
    second_last_name: "Rodriguez",
    birth: "1993-01-22",
    gender: "Male",
    role: "Employee",
    createdAt: "2024-05-10T12:00:00.000Z",
    notificationToken: "klm789xyz",
    address: "404 Elm St, Miami, FL",
    position: "Sales Executive",
  },
  {
    uid: "8",
    email: "sarah.davis@example.com",
    displayName: "Sarah Davis",
    photoURL: "https://example.com/photo8.jpg",
    phoneNumber: "+1234567897",
    first_name: "Sarah",
    second_name: "Elizabeth",
    last_name: "Davis",
    second_last_name: "Martinez",
    birth: "1989-09-25",
    gender: "Female",
    role: "Manager",
    createdAt: "2024-05-20T17:15:00.000Z",
    notificationToken: "abc789efg",
    address: "505 Spruce St, Boston, MA",
    position: "Operations Manager",
  },
  {
    uid: "9",
    email: "daniel.martin@example.com",
    displayName: "Daniel Martin",
    photoURL: "https://example.com/photo9.jpg",
    phoneNumber: "+1234567898",
    first_name: "Daniel",
    second_name: "Paul",
    last_name: "Martin",
    second_last_name: "Lopez",
    birth: "1991-04-05",
    gender: "Male",
    role: "Employee",
    createdAt: "2024-06-01T18:30:00.000Z",
    notificationToken: "hij234klm",
    address: "606 Willow St, Dallas, TX",
    position: "Marketing Specialist",
  },
  {
    uid: "10",
    email: "olivia.taylor@example.com",
    displayName: "Olivia Taylor",
    photoURL: "https://example.com/photo10.jpg",
    phoneNumber: "+1234567899",
    first_name: "Olivia",
    second_name: "Grace",
    last_name: "Taylor",
    second_last_name: "Hernandez",
    birth: "1994-07-30",
    gender: "Female",
    role: "Admin",
    createdAt: "2024-06-10T09:00:00.000Z",
    notificationToken: "lmn890opq",
    address: "707 Oak St, Denver, CO",
    position: "CTO",
  },
  {
    uid: "11",
    email: "benjamin.wilson@example.com",
    displayName: "Benjamin Wilson",
    photoURL: "https://example.com/photo11.jpg",
    phoneNumber: "+1234567810",
    first_name: "Benjamin",
    second_name: "Lucas",
    last_name: "Wilson",
    second_last_name: "Garcia",
    birth: "1986-11-12",
    gender: "Male",
    role: "Manager",
    createdAt: "2024-06-20T14:45:00.000Z",
    notificationToken: "opq123rst",
    address: "808 Pine St, Phoenix, AZ",
    position: "Operations Manager",
  },
  {
    uid: "12",
    email: "hannah.moore@example.com",
    displayName: "Hannah Moore",
    photoURL: "https://example.com/photo12.jpg",
    phoneNumber: "+1234567811",
    first_name: "Hannah",
    second_name: "Sophia",
    last_name: "Moore",
    second_last_name: "Miller",
    birth: "1996-10-13",
    gender: "Female",
    role: "Employee",
    createdAt: "2024-07-05T13:20:00.000Z",
    notificationToken: "uvw123xyz",
    address: "909 Cedar St, Seattle, WA",
    position: "Customer Support",
  }
]

const columns = [
	columnHelper.accessor('photoURL', {
		cell: (info) => (
			<Link to={`algo/${info.row.original.uid}`}>
				<Avatar
					src={info.row.original.photoURL ? info.row.original.photoURL : ''}
					name={`${info.row.original.first_name} ${info.row.original.last_name}`}
					className='!w-10'
					rounded='rounded-full'
				/>
			</Link>
		),
		header: 'Image',
		footer: 'Image',
		enableGlobalFilter: false,
		enableSorting: false,
	}),
	columnHelper.accessor('displayName', {
		cell: (info) => (
			<Link to={`algo/${info.row.original.uid}`}>
				<div className='font-bold'>{`${info.row.original.first_name} ${info.row.original.last_name}`}</div>
				<div className='text-sm'>@{info.getValue()}</div>
			</Link>
		),
		header: 'Username',
		footer: 'Username',
	}),
	columnHelper.accessor('email', {
		cell: (info) => (
			<a href={`mailto:${info.getValue()}`} className='flex items-center gap-2'>
				{info.getValue()}
				{info.row.original.email && <Icon icon='HeroCheckBadge' color='blue' />}
			</a>
		),
		header: 'Email',
		footer: 'Email',
	}),
	columnHelper.accessor('position', {
		cell: (info) => <span>{info.getValue()}</span>,
		header: 'Position',
		footer: 'Position',
	}),
];

const UserListPartial = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [data] = useState<User[]>(() => [...users]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
		// debugTable: true,
	});

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardHeaderChild>
					<CardTitle>Users</CardTitle>
				</CardHeaderChild>
				<CardHeaderChild>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilter && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => {
										setGlobalFilter('');
									}}
								/>
							)
						}>
						<Input
							id='example'
							name='example'
							placeholder='Search...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</CardHeaderChild>
			</CardHeader>
			<CardBody className='overflow-auto'>
				<TableTemplate
					className='table-fixed max-md:min-w-[70rem]'
					table={table}
					hasFooter={false}
				/>
			</CardBody>
			<TableCardFooterTemplate table={table} />
		</Card>
	);
};

export default UserListPartial;
