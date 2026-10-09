import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-southeast-2';
const rawClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(rawClient);

const users = [
  {
    id: "usr_resident_01",
    name: "Resident Citizen",
    email: "resident@indohood.in",
    role: "resident",
    address: "Flat 402, Green Valley Apartments, New Delhi",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    bio: "Eco-conscious citizen driving zero-waste living and source segregation 🌱",
    location: "New Delhi",
    walletBalance: 0,
    tier: "Tier 3 Master Recycler"
  },
  {
    id: "usr_picker_01",
    name: "Eco-Picker",
    email: "picker@indohood.in",
    role: "picker",
    address: "Dwarka Sector 12, New Delhi",
    phone: "+91 98111 22334",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    bio: "Certified circular waste aggregator & doorstep clean segregation verifier 🚛",
    location: "New Delhi",
    assignedPickupsCount: 0,
    completedPickupsCount: 0
  }
];

async function seed() {
  console.log('Seeding IndoHood_Users into DynamoDB in', REGION);
  for (const u of users) {
    await docClient.send(new PutCommand({
      TableName: 'IndoHood_Users',
      Item: u
    }));
    console.log('✓ Seeded user:', u.id, u.name);
  }

  const res = await docClient.send(new ScanCommand({ TableName: 'IndoHood_Users' }));
  console.log('Verification: IndoHood_Users now has', res.Items.length, 'records');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
