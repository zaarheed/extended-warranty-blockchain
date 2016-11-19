#!/bin/bash
# set -e

# this script is supposed to run on Ubuntu 14.04 (default for Ethereum Studio)

# remove folder with default contracts
cd
cd workspace
rm example-project -r

# setup example project:
mkdir course-example
cd course-example
mkdir contracts
wget https://raw.githubusercontent.com/validitylabs/ValidityWireframe/master/ethereum.json

# update nodejs to 6.x which is required for ipfs-api
#curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
#sudo apt-get install -y nodejs
