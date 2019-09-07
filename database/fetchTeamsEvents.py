import requests  # 导入requests库，用于发送http请求
import json  # 用于解析json

base_link = 'https://www.thebluealliance.com/api/v3'
team_api = '/teams/all/simple'
event_api = '/events/all/simple'

headers = {
    'content-type': 'application/json',  # 文本类型为Json
    'X-TBA-Auth-Key': 'kbxvOnS2csBH6fzQ8zijLw2f1k135fWp8NgTEfPRg1n8hYqh7SSUo9VJ3JEBlnIg',  # tba请求认证key
}

teams_info = json.loads(requests.get(base_link+team_api, headers).text)
events_info = json.loads(requests.get(base_link+event_api, headers).text)

teams_info_file = open('teams-python.json','w')
events_info_file = open('events-python.json','w')

for i in teams_info:
    teams_info_file.write(i)
teams_info_file.close()

for i in events_info:
    events_info_file.write(i)
events_info_file.close()
