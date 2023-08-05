#!/bin/bash
rsync -avzr --delete -e "ssh -p $DEPLOY_PORT -i $DEPLOY_KEY" ./ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
